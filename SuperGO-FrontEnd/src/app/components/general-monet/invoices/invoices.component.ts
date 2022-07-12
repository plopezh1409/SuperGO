import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import { FormInvoicesService } from '@app/core/services/invoices/formInvoices.service';
import { InvoicesTableComponent } from './invoices-table/invoices-table.component';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { Control } from '@app/core/models/capture/controls.model';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import { MonetizationRules } from '@app/core/models/ServiceResponseData/monetization-response.model';
import { InvoicesResponse } from '@app/core/models/ServiceResponseData/invoices-response.model';
import { DropdownEvent } from '@app/core/models/capture/dropdown-event.model';
import { MonetizationModule } from '../monetization/helper/monetization/monetization.module';
import { AuthService } from '@app/core/services/sesion/auth.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass']
})

export class InvoicesComponent implements OnInit {
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly monetizationModule: MonetizationModule = new MonetizationModule();
  private formInvoicesService:FormInvoicesService;
  private messageError:MessageErrorModule;
  private authService: AuthService;
  public reactiveForm:ReactiveForm;
  public containers:Container[];
  public maxNumControls:number;
  public alignContent='horizontal';
  public dataInfo:Facturas[];
  public idSolicitud : string |null;

  @ViewChild(InvoicesTableComponent) catalogsTable:InvoicesTableComponent;
  constructor( private readonly appComponent: AppComponent, private readonly injector:Injector,
    private readonly _route: ActivatedRoute) {
    this.formInvoicesService = this.injector.get<FormInvoicesService>(FormInvoicesService);
    this.authService = this.injector.get<AuthService>(AuthService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new InvoicesTableComponent(this.injector);
    this.messageError = new MessageErrorModule();
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.idSolicitud=null;
    this.maxNumControls = 10;
  }

  ngOnInit(): void {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null){
      this.fillDataPage();
    }
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    const dataForm = await this.formInvoicesService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    if(!this.authService.isAuthenticated()){
      this.appComponent.showLoader(false);
      return;
    }
    const dataOper = await this.formInvoicesService.getInfoInvoices().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code !== this.codeResponse.RESPONSE_CODE_200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code === this.codeResponse.RESPONSE_CODE_200){
      this.dataInfo = dataOper.response.facturas;
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
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response);
      this.dataInfo = dataOper.response.facturas;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }


  onSubmit(value:{})
  {
    if(!this.reactiveForm.principalForm?.valid){
      this.messageError.showMessageErrorForm();
      return;
    }
    let dataContainer;
    for(const data of Object.values(value)){
      dataContainer = Object(data);
    }
    const oInvoice:Facturas = new Facturas();
    oInvoice.idSociedad = parseInt(dataContainer.idSociedad,10);
    oInvoice.idSubtipo = parseInt(dataContainer.idSubtipo ,10);
    oInvoice.idTipo = parseInt(dataContainer.idTipo ,10);
    oInvoice.tipoComprobante = parseInt(dataContainer.tipoComprobante,10);
    oInvoice.tipoFactura = parseInt(dataContainer.tipoFactura,10);
    oInvoice.idReglaMonetizacion = dataContainer.idReglaMonetizacion;
    //Nuevos campos ja.dejesus 2.2
    oInvoice.formaPago = dataContainer.formaPago;
    oInvoice.usoCFDI = dataContainer.usoCFDI;
    oInvoice.descripcionFactura = dataContainer.descripcionFactura.trim();
    oInvoice.claveServicio = dataContainer.claveServicio;
    oInvoice.metodoPago = dataContainer.metodoPago;

    this.appComponent.showLoader(true);
    this.formInvoicesService.insertInvoice(oInvoice).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data: IResponseData<GenericResponse> ) => {
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

  addDataDropdown(dataForm:Container[], dataContent:any){
    const cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.facturas;
    for(const value in cpDataContent){
      if(value === 'metodoPago' || value === 'formaPago' || value === 'usoCFDI' || value === 'claveServicio'){
        cpDataContent[value].forEach((ele:any) => {
          for(const entries in ele){
            if(entries !== 'descripcion'){
              ele['ky'] = ele[entries];
            }
            else{
              ele['value'] = ele[entries];
            }
            delete ele[entries];
          }
        });
      }
      else{
        cpDataContent[value].forEach((ele:any) => {
          for(const entries in ele){
            if(typeof ele[entries] === 'number'){
              ele['ky'] = ele[entries];
            }
            else{
              ele['value'] = ele[entries];
            }
            delete ele[entries];
          }
        });
      }

    }

    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.controlType === 'dropdown' && ctrl.content){
          if(ctrl.ky === 'idSociedad'){
            ctrl.content.contentList = cpDataContent.sociedades;
            ctrl.content.options = cpDataContent.sociedades;
          }
          else if (ctrl.ky === 'idTipo'){
            ctrl.content.contentList = cpDataContent.operaciones;
            ctrl.content.options = cpDataContent.operaciones;
          }
          else if(ctrl.ky === 'metodoPago'){
            ctrl.content.contentList = cpDataContent.metodoPago;
            ctrl.content.options = cpDataContent.metodoPago;
          }
          else if( ctrl.ky === 'formaPago'){
            ctrl.content.contentList = cpDataContent.formaPago;
            ctrl.content.options = cpDataContent.formaPago;
          }
          else if( ctrl.ky === 'usoCFDI'){
            ctrl.content.contentList = cpDataContent.usoCFDI;
            ctrl.content.options = cpDataContent.usoCFDI;
          }
          else if( ctrl.ky === 'claveServicio'){
            ctrl.content.contentList = cpDataContent.claveServicio;
            ctrl.content.options = cpDataContent.claveServicio;
          }
          else{

          }
        }
      });
    });
    return dataForm;
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.formInvoicesService.getInfoInvoices().pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:IResponseData<InvoicesResponse>)=>{
      if(data.code === this.codeResponse.RESPONSE_CODE_200){
        this.dataInfo = data.response.facturas;
        this.catalogsTable.onLoadTable(this.dataInfo);
      }
      else{
        this.messageError.showMessageErrorLoadData();
      }
    },(err) => {
      this.messageError.showMessageErrorLoadData();
    });
  }

onChangeDropDown($event: DropdownEvent){
  if($event.control.ky !== 'idTipo' && $event.control.ky !== 'idSociedad') {
    return;
  }
  const dataContainer = this.reactiveForm.getDataForm(this.containers);
  if(dataContainer.idSociedad === null || dataContainer.idTipo === null){
    return;
  }
  const [idTipo, idSociedad] = [dataContainer.idTipo, dataContainer.idSociedad];
  const society = {
    idSociedad,
    idTipo
  };
  this.appComponent.showLoader(true);
  this.formInvoicesService.getMonetizacionRules(society).pipe(finalize(() => {
    this.appComponent.showLoader(false);
  })).subscribe((data: IResponseData<MonetizationRules[]> ) => {
    if(data.code === this.codeResponse.RESPONSE_CODE_201){
      if(data.response.length !== 0){
        this.monetizationModule.addDataControlMonetization(this.containers, data.response);
      }
      else{
        const dataForm = this.reactiveForm.getDataForm(this.containers);
        this.monetizationModule.addDataControlMonetization(this.containers, []);
        this.containers[0] = this.monetizationModule.setControlsIdRegla(dataForm,this.containers[0]);
        this.reactiveForm.setContainers(this.containers);
        swal.fire({
          icon: 'warning',
          title: '¡Aviso!',
          text: 'La Sociedad y Operación no cuentan con Reglas de Monetización disponibles.',
          heightAuto: false,
          confirmButtonText: 'ACEPTAR',
          allowOutsideClick: false
        });
      }
    }
    else{
      this.messageError.showMessageError(data.message.toString(), data.code);
    }
  },(err) => {
    this.messageError.showMessageErrorRequest();
  });
}
}
