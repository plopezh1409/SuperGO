import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import { FormInvoicesService } from '@app/core/services/invoices/formInvoices.service';
import { invoicesTableComponent } from './invoices-table/invoices-table.component';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

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
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Facturas[];
  public idSolicitud : string |null;

  @ViewChild(invoicesTableComponent) catalogsTable:invoicesTableComponent;


  constructor( private readonly appComponent: AppComponent, private injector:Injector,
    private readonly _route: ActivatedRoute) { 
    this.formInvoicesService = this.injector.get<FormInvoicesService>(FormInvoicesService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new invoicesTableComponent();
    this.messageError = new MessageErrorModule();
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.idSolicitud=null;
  }

  ngOnInit(): void {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null)
      this.fillDataPage();
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.formInvoicesService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    var dataOper = await this.formInvoicesService.getInfoInvoices().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== 200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== 200) {
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response);
      console.log(this.containers);
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
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
    for(var datas of Object.values(value)){
      dataBody = Object(datas);
    }
    var oInvoice:Facturas =  dataBody;
    this.appComponent.showLoader(true);
    this.formInvoicesService.insertInvoice(oInvoice).pipe(finalize(() => { this.appComponent.showLoader(false); }))
    .subscribe((data:any)=>{
      if(data.code == 200){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.message,
          heightAuto: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false
        }).then((result)=>{
          if(result.isConfirmed){
            this.reactiveForm.setContainers(this.containers);
            this.updateTable();
          }
        });
      }
      else{
        this.messageError.showMessageError(data.message, data.code)
      }
    },(err:any) => {
      this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
    });

  }

  addDataDropdown(dataForm:any, dataContent:any){
    var cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.facturas
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
    dataForm.forEach((element:any) => {
      element.controls.forEach((ctrl:any) => {
        if(ctrl.controlType === 'dropdown'){
          if(ctrl.ky === 'idSociedad'){
            ctrl.content.contentList = cpDataContent.sociedades;
            ctrl.content.options = cpDataContent.sociedades;
          }
        }
      });
    });
    return dataForm;
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.formInvoicesService.getInfoInvoices().pipe(finalize(() => { this.appComponent.showLoader(false); })).
    subscribe((data:any)=>{
      switch (data.code) {
        case 200:
          this.dataInfo = data.response;
          this.catalogsTable.onLoadTable(this.dataInfo);
        break;
    case 400:
    case 401:
    case 404:
    case 500:
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: "Ocurrió un error al cargar los datos, intente mas tarde.",
        heightAuto: false
      });
    break;
    default:
      break;
    }
},(err:any) => {
  swal.fire({
    icon: 'error',
    title: 'Error inesperado',
    text: "Ocurrió un error al cargar los datos, intente mas tarde.",
    heightAuto: false
  });      
});
}

}

