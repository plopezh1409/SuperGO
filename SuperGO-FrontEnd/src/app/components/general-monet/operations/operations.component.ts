import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { OperationsTableComponent } from './operations-table/operations-table.component';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

//SERVICES
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';

//MODELS
import { Container } from '@app/core/models/capture/container.model';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { OperationsResponse } from '@app/core/models/ServiceResponseData/operations-response.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import { DropdownModel } from '@app/core/models/dropdown/dropdown.model';
import { Control } from '@app/core/models/capture/controls.model';
import { DropdownFunctionality } from '@app/shared/dropdown/dropdown-functionality';
import { AuthService } from '@app/core/services/sesion/auth.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.sass']
})

export class OperationsComponent implements OnInit {

  private formCatService:FormOperationsService;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly dropDownFunc: DropdownFunctionality;
  private messageError:MessageErrorModule;
  private authService: AuthService;
  private idSolicitud: string | null;
  public reactiveForm:ReactiveForm;
  public containers:Container[];
  public maxNumControls:number;
  public alignContent='horizontal';
  public dataInfo:Operaciones[];

  @ViewChild(OperationsTableComponent) catalogsTable:OperationsTableComponent;

  constructor(private readonly appComponent: AppComponent, private readonly injector:Injector,
    private readonly _route: ActivatedRoute) {
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.authService = this.injector.get<AuthService>(AuthService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.catalogsTable = new OperationsTableComponent();
    this.dropDownFunc = new DropdownFunctionality();
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.idSolicitud=null;
    this.maxNumControls = 10;
  }

  ngOnInit() {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null){
      this.fillDataPage();
    }
  }

  onSubmit(value:{})
  {
    if(!this.reactiveForm.principalForm?.valid){
      this.messageError.showMessageErrorForm();
      return;
    }
    let dataBody;
    for(const datas of Object.values(value)){
      dataBody = Object(datas);
    }
    const obOpe:Operaciones =  new Operaciones();
    obOpe.descripcionTipo = dataBody.descripcionTipo.trim();
    obOpe.idCanal = parseInt(dataBody.idCanal,10);
    obOpe.topicoKafka = dataBody.topicoKafka.trim();
    obOpe.status = dataBody.status === true ?'A':'I';
    this.appComponent.showLoader(true);
    this.formCatService.insertOperation(obOpe).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:IResponseData<GenericResponse>)=>{
      if(data.code === this.codeResponse.RESPONSE_CODE_201){
        swal.fire({
          icon: 'success',
          title: 'Solicitud Correcta',
          text: data.message.toString().toUpperCase(),
          heightAuto: false,
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        }).then((result)=>{
          if(result.isConfirmed){
            this.reactiveForm.setContainers(this.containers);
            this.updateTable();
          }
        });
      }
      else{
        this.messageError.showMessageError(data.message.toString(), data.code);
      }
    },(err) => {
      this.messageError.showMessageErrorRequest();
    });
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    const dataForm = await this.formCatService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    if(!this.authService.isAuthenticated()){
      this.appComponent.showLoader(false);
      return;
    }
    const dataOper = await this.formCatService.getInfoOperation().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code !== this.codeResponse.RESPONSE_CODE_200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code === this.codeResponse.RESPONSE_CODE_200){
      this.dataInfo = dataOper.response.tipoOperacion;
      this.catalogsTable.onLoadTable(this.dataInfo);
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== this.codeResponse.RESPONSE_CODE_200 && dataForm.code === this.codeResponse.RESPONSE_CODE_200) {
      this.containers = dataForm.response.reactiveForm;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = dataForm.response.reactiveForm; //this.addDataDropdown(dataForm.response.reactiveForm, dataOper.response);
      this.dataInfo = dataOper.response.tipoOperacion;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  addDataDropdown(dataForm:Container[], dataContent:any){
    let cpDataContent:any = Object.assign({},dataContent);
    delete cpDataContent.tipoOperacion;
    cpDataContent = this.dropDownFunc.createValues(cpDataContent);
    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.content && ctrl.controlType === 'dropdown'){
          if(ctrl.ky === 'idCanal'){
            ctrl.content.contentList = cpDataContent.canal;
            ctrl.content.options = cpDataContent.canal;
          }
        }
      });
    });
    return dataForm;
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.formCatService.getInfoOperation().pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:IResponseData<OperationsResponse>)=>{
      if( data.code === this.codeResponse.RESPONSE_CODE_200){
        this.dataInfo = data.response.tipoOperacion;
        this.catalogsTable.onLoadTable(this.dataInfo);
      }
      else{
        this.messageError.showMessageErrorLoadData();
      }
    },(err) => {
      this.messageError.showMessageErrorLoadData();
  });
  }
}
