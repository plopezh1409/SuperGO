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

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass']
})

export class invoicesComponent implements OnInit {
  formInvoicesService:FormInvoicesService;
  reactiveForm:ReactiveForm;
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
      this.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== 200) {
      this.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response);
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
    console.log(oInvoice);

    this.appComponent.showLoader(true);
    this.formInvoicesService.insertInvoice(oInvoice).pipe(finalize(() => { this.appComponent.showLoader(false); }))
    .subscribe((data:any)=>{
      console.log(data);
      switch (data.code) {
        case 201: //Solicitud correcta
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.menssage,
          heightAuto: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false
        }).then((result)=>{
          if(result.isConfirmed){
            this.reactiveForm.setContainers(this.containers);
            this.updateTable();
          }
        });
          break;
        case 400: //Solicitud incorrecta
          swal.fire({
            icon: 'warning',
            title: 'Solicitud incorrecta',
            text: data.menssage,
            heightAuto: false
          });
          break;
        case 401://No autorizado
          swal.fire({
            icon: 'warning',
            title: 'No autorizado',
            text: data.menssage,
            heightAuto: false
          });
          break;
        case 500://Error Inesperado
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: data.menssage,
            heightAuto: false
          });
          break;
        default:
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: "Intente mas tarde",
            heightAuto: false
          });
          break;
        }
    });

  }

  addDataDropdown(dataForm:any, dataContent:any){
    var cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.facturas
    Object.entries(cpDataContent).map(([key, value]:any, idx:number) =>{
      value.forEach((ele:any) => {
        Object.entries(ele).map(([key, value]:any, idx:number) => {
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
          else if (ctrl.ky === 'idTipoOperacion'){
            ctrl.content.contentList = cpDataContent.operaciones;
            ctrl.content.options = cpDataContent.operaciones;
          }
          else if (ctrl.ky === 'idSubTipoOperacion'){
            ctrl.content.contentList = cpDataContent.subOperacion;
            ctrl.content.options = cpDataContent.subOperacion;
          }
          else if (ctrl.ky === 'tipoComprobante'){
            ctrl.content.contentList = cpDataContent.tipoComprobante;
            ctrl.content.options = cpDataContent.tipoComprobante;
          }
          else if (ctrl.ky === 'tipoFactura'){
            ctrl.content.contentList = cpDataContent.tipoFactura;
            ctrl.content.options = cpDataContent.tipoFactura;
          }
          else if (ctrl.ky === 'idReglaMonetizacion'){
            ctrl.content.contentList = cpDataContent.monetizacion;
            ctrl.content.options = cpDataContent.monetizacion;  
          }
        }
      });
    });
    return dataForm;
  }

  showMessageError(menssage:string, code:number){
    switch (code) {
      case 400: //Solicitud incorrecta
        swal.fire({
          icon: 'warning',
          title: 'Solicitud incorrecta',
          text: menssage,
          heightAuto: false
        });
        break;
      case 404://No autorizado
        swal.fire({
          icon: 'warning',
          title: 'No autorizado',
          text: menssage,
          heightAuto: false
        });
        break;
      case 500://Error Inesperado
        swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: menssage,
          heightAuto: false
        });
        break;
      default:
        break;
    }
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
    case 400: //Solicitud incorrecta
    case 401:
    case 500:
    default:
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: "Ocurrió un error al cargar los datos, intente mas tarde.",
        heightAuto: false
      });
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

