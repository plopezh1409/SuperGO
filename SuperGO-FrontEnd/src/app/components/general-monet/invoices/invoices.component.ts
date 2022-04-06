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

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass']
})

export class InvoicesComponent implements OnInit {
  formInvoicesService:FormInvoicesService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls:number;
  alignContent='horizontal';
  public dataInfo:Facturas[];
  public idSolicitud : string |null;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly monetizationModule: MonetizationModule = new MonetizationModule();

  @ViewChild(InvoicesTableComponent) catalogsTable:InvoicesTableComponent;
  constructor( private readonly appComponent: AppComponent, private readonly injector:Injector,
    private readonly _route: ActivatedRoute) { 
    this.formInvoicesService = this.injector.get<FormInvoicesService>(FormInvoicesService);
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
    const dataOper = await this.formInvoicesService.getInfoInvoices().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== this.codeResponse.RESPONSE_CODE_200) {
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
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
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
    this.appComponent.showLoader(true);
    this.formInvoicesService.insertInvoice(oInvoice).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data: IResponseData<GenericResponse> ) => {
      if(data.code === this.codeResponse.RESPONSE_CODE_201){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.message.toString(),
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
      this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
    });

  }

  addDataDropdown(dataForm:Container[], dataContent:any){
    const cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.facturas;
    for(const value in cpDataContent){
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
      switch (data.code) {
        case this.codeResponse.RESPONSE_CODE_200:
          this.dataInfo = data.response.facturas;
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
},(err) => {
  swal.fire({
    icon: 'error',
    title: 'Error inesperado',
    text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
    heightAuto: false
  });      
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
        swal.fire({
          icon: 'warning',
          title: '¡Aviso!',
          text: 'La Sociedad y la Operación no cuentan con Reglas de Monetización disponibles.',
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
    this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
  });
}
}