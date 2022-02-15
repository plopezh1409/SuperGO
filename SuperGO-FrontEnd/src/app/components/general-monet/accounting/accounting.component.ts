import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { AccountingTablesComponent } from './accounting-tables/accounting-tables.component';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.sass']
})

export class AccountingComponent implements OnInit {

  accountService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Contabilidad[];

  @ViewChild(AccountingTablesComponent) catalogsTable:AccountingTablesComponent;


  constructor( private readonly appComponent: AppComponent, private injector:Injector) { 
    this.accountService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new AccountingTablesComponent(this.injector);
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
  }

  ngOnInit(): void {
    this.fillDataPage();
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

    var oConta:Contabilidad =  new Contabilidad();
    oConta.idSociedad = dataBody.sociedad;
    oConta.idTipoOperacion = dataBody.operacion;
    oConta.idSubtipoOperacion = dataBody.subOperacion;
    oConta.idReglaMonetizacion = dataBody.monetizacion;
    oConta.contabilidadDiaria = dataBody.contabilidadDiaria == "true"?"D":"C";
    oConta.numeroApunte = dataBody.numeroDeApunte;
    oConta.sociedadGl = dataBody.sociedadGl;
    oConta.tipoCuenta = dataBody.tipoCuenta;
    oConta.cuentaSAP = dataBody.cuentaSap;
    oConta.claseDocumento = dataBody.claseDeDocumento;
    oConta.concepto = dataBody.concepto;
    oConta.centroDestino = dataBody.centroDestino;
    oConta.indicadorIVA = dataBody.IVA == "true"? "AA":"NA";
    oConta.indicadorOperacion = dataBody.cargoAbono;

    /*this.appComponent.showLoader(true);
    this.accountService.insertAccounting(oConta).pipe(finalize(() => { this.appComponent.showLoader(false); }))
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
    });*/

  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.accountService.getForm().toPromise().catch((err) =>{
      return err;
    });
    var dataAcco = await this.accountService.getInfoAccounting().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== 200){
      this.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataAcco.code !== 200) {
      this.showMessageError(dataAcco.message, dataAcco.code);
    }
    else{
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataAcco.response);
      console.log(this.containers);
      this.dataInfo = dataAcco.response.registrosContables;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  addDataDropdown(dataForm:any, dataContent:any){
    var cpDataContent = Object.assign({},dataContent);
    delete cpDataContent.registrosContables
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
          if(ctrl.ky === 'sociedad'){
            ctrl.content.contentList = cpDataContent.sociedades;
            ctrl.content.options = cpDataContent.sociedades;
          }
          else if (ctrl.ky === 'operacion'){
            ctrl.content.contentList = cpDataContent.operaciones;
            ctrl.content.options = cpDataContent.operaciones;
          }
          else if (ctrl.ky === 'subOperacion'){
            ctrl.content.contentList = cpDataContent.subOperacion;
            ctrl.content.options = cpDataContent.subOperacion;
          }
          else if (ctrl.ky === 'monetizacion'){
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
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: "Intente de nuevo",
              heightAuto: false
            });
            break;
        }
      }

      updateTable(){
        this.appComponent.showLoader(true);
        this.accountService.getInfoAccounting().pipe(finalize(() => { this.appComponent.showLoader(false); })).
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
