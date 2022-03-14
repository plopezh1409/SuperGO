import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { AccountingTablesComponent } from './accounting-tables/accounting-tables.component';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceNoMagicNumber, ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.sass']
})

export class AccountingComponent implements OnInit {

  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  accountService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls:number;
  alignContent='horizontal';
  public dataInfo:Contabilidad[];
  public idSolicitud: string | null;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();


  @ViewChild(AccountingTablesComponent) catalogsTable:AccountingTablesComponent;


  constructor( private readonly appComponent: AppComponent, private readonly injector:Injector,
    private readonly _route: ActivatedRoute) { 
    this.accountService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.catalogsTable = new AccountingTablesComponent(this.injector);
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.idSolicitud=null;
    this.maxNumControls= Number(this.codeResponseMagic.RESPONSE_CODE_10);
  }

  ngOnInit(): void {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null){
      this.fillDataPage();
    }
  }

  onSubmit(value:any)
  {
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }
    
    let dataBody;
    for(let datas of Object.values(value)){
      dataBody = Object(datas);
    }
    const oConta:Contabilidad =  new Contabilidad();
    oConta.idSociedad = dataBody.idSociedad;
    oConta.idTipoOperacion = parseInt(dataBody.idTipoOperacion,10);
    oConta.idSubtipoOperacion = parseInt(dataBody.idSubTipoOperacion,10);
    oConta.numeroApunte = parseInt(dataBody.numeroApunte,10);
    oConta.sociedadGl = dataBody.sociedadGl.trim();
    oConta.tipoCuenta = dataBody.tipoCuenta.trim();
    oConta.cuentaSAP = dataBody.cuentaSAP.trim();
    oConta.claseDocumento = dataBody.claseDocumento.trim();
    oConta.concepto = dataBody.concepto.trim();
    oConta.centroDestino = dataBody.centroDestino.trim();
    oConta.contabilidadDiaria = dataBody.contabilidadDiaria === true?'D':'C';
    oConta.indicadorIVA = dataBody.indicadorIVA === true? 'AA':'NA';
    oConta.indicadorOperacion = dataBody.indicadorOperacion === '1' ? 'C': 'A';
    this.appComponent.showLoader(true);
    this.accountService.insertAccounting(oConta).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:any)=>{
      if(data.code === this.codeResponse.RESPONSE_CODE_201){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.menssage,
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
        this.messageError.showMessageError(data.message, data.code);
      }
    },(err) => {
      this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
    });

  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    const dataForm = await this.accountService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    const dataAcco = await this.accountService.getInfoAccounting().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataAcco.code !== this.codeResponse.RESPONSE_CODE_200) {
      this.messageError.showMessageError(dataAcco.message, dataAcco.code);
    }
    else{
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataAcco.response);
      this.dataInfo = dataAcco.response.registrosContables;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  addDataDropdown(dataForm:any, dataContent:any){
    let cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.registrosContables;
    Object.entries(cpDataContent).forEach(([key, value]:any[], idx:number) =>{
      value.forEach((ele:any) => {
        Object.entries(ele).forEach(([_key, _value]:any[], idx:number) => {
          if(typeof _value === 'number'){
            ele['ky'] = ele[_key];
            delete ele[_key];
          }
          else{
            ele['value'] = ele[_key];
            delete ele[_key];
          }
        });
      });
    });
    dataForm.forEach((element:any) => {
      element.controls.forEach((ctrl:any) => {
        if(ctrl.controlType === 'dropdown' && ctrl.ky === 'idSociedad'){
          ctrl.content.contentList = cpDataContent.sociedades;
          ctrl.content.options = cpDataContent.sociedades;
        }
      });
    });
    return dataForm;
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.accountService.getInfoAccounting().pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:any)=>{
      switch (data.code) {
        case this.codeResponse.RESPONSE_CODE_200:
            this.dataInfo = data.response;
            this.catalogsTable.onLoadTable(this.dataInfo);
          break;
          case this.codeResponse.RESPONSE_CODE_400:
          case this.codeResponse.RESPONSE_CODE_401:
          case this.codeResponse.RESPONSE_CODE_404:
          case this.codeResponse.RESPONSE_CODE_500:
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
              heightAuto: false
            });
          break;
        default:
        break;
        }
    },() => {
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
        heightAuto: false
      });      
    });
  }

}
