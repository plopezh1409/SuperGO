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

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass']
})

export class invoicesComponent implements OnInit {
  formInvoicesService:FormInvoicesService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls:number;
  alignContent='horizontal';
  public dataInfo:Facturas[];
  public idSolicitud : string |null;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();


  @ViewChild(InvoicesTableComponent) catalogsTable:InvoicesTableComponent;

  constructor( private readonly appComponent: AppComponent, private injector:Injector,
    private readonly _route: ActivatedRoute) { 
    this.formInvoicesService = this.injector.get<FormInvoicesService>(FormInvoicesService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new InvoicesTableComponent();
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
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
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
    const oInvoice:Facturas =  dataBody;
    this.appComponent.showLoader(true);
    this.formInvoicesService.insertInvoice(oInvoice).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:any)=>{
      if(data.code === this.codeResponse.RESPONSE_CODE_200){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.message,
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

  addDataDropdown(dataForm:any, dataContent:any){
    let cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.facturas;
    Object.entries(cpDataContent).forEach(([key, value]:any, idx:number) =>{
      value.forEach((ele:any) => {
        Object.entries(ele).forEach(([key, value]:any, idx:number) => {
          if(typeof value === 'number'){
            ele['ky'] = ele[key];
            delete ele[key];
          }
          else{
            ele['value'] = ele[key];
            delete ele[key];
          }
        });
      });
    });

    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.controlType === 'dropdown' && ctrl.ky === 'idSociedad'){
          ctrl.content!.contentList = cpDataContent.sociedades;
          ctrl.content!.options = cpDataContent.sociedades;
        }
      });
    });
    return dataForm;
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.formInvoicesService.getInfoInvoices().pipe(finalize(() => {
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
},(err) => {
  swal.fire({
    icon: 'error',
    title: 'Error inesperado',
    text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
    heightAuto: false
  });      
});
}

}

