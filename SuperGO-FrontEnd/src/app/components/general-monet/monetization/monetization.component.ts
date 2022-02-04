import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';
import { MonetizationTableComponent } from './monetization-table/monetization-table.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-monetization',
  templateUrl: './monetization.component.html',
  styleUrls: ['./monetization.component.sass']
})

export class MonetizationComponent implements OnInit {

  monetService:FormMonetizationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Monetizacion[];

  @ViewChild(MonetizationTableComponent) catalogsTable:MonetizationTableComponent;


  constructor(private readonly appComponent: AppComponent, private injector:Injector) { 
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new MonetizationTableComponent();
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
  }

  ngOnInit(): void {
    this.fillDataPage();
    this.dataInfo=[{idSociedad:'ELEKTRA',idTipo:'PAGO DE SERVICIOS',idSubtipo:'GENERAL',segmento:"67876.98",montoMonetizacion:"10.00",tipoMonto:"F",idTipoImpuesto:"1",codigoDivisa:"MXN",emisionFactura:"S",indicadorOperacion:"C",periodisidadCorte:"12/02/2021",fechaInicio:"12/02/2021",fechaFin:"13/02/2021" } as Monetizacion,];

  }

  onSubmit()
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
    let obj:Monetizacion = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['MONETIZACION'] as Monetizacion;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }    
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.monetService.getForm().toPromise().catch((err) =>{
      return err;
    });
    var dataOper = await this.monetService.getDataMonetization().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== 200){
      this.showMessageError(dataForm.message, dataForm.code);
    }
    // else if(dataOper.code !== 200) {
    //   this.showMessageError(dataOper.message, dataOper.code);
    // }
    else{
      this.containers = dataForm.response.reactiveForm;//this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response);
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
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
        // swal.fire({
        //   icon: 'error',
        //   title: 'Error inesperado',
        //   text: "Intente de nuevo",
        //   heightAuto: false
        // });
        break;
    }
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
          else if (ctrl.ky === 'tipoDeComprobante'){
            ctrl.content.contentList = cpDataContent.tipoComprobante;
            ctrl.content.options = cpDataContent.tipoComprobante;
          }
          else if (ctrl.ky === 'tipoDeFactura'){
            ctrl.content.contentList = cpDataContent.tipoFactura;
            ctrl.content.options = cpDataContent.tipoFactura;
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


}

