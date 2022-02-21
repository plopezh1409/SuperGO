import { Component,Inject, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2'

//Models
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { PeriodicityModule } from '@app/core/helper/periodicity/periodicity.module';
import { MonetizationModule } from '@app/core/helper/monetization/monetization.module';
//Servicio
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';

import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-update-modal-monetization',
  templateUrl: './update-modal-monetization.component.html',
  styleUrls: ['./update-modal-monetization.component.sass']
})

export class UpdateModalMonetizationComponent implements OnInit {

  monetService:FormMonetizationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private showLoad: boolean = false;
  private loaderDuration: number;
  public showButtonAdd: boolean;
  private selectedValRequest: any;
  public principalContainers: Container[];
  private periodicity:PeriodicityModule;
  private monetModule:MonetizationModule;
  private objIds:any;
  private appComp:AppComponent;

  constructor(private changeDetectorRef: ChangeDetectorRef,private injector:Injector,public refData?:MatDialogRef<UpdateModalMonetizationComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.appComp = this.injector.get<AppComponent>(AppComponent);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
    this.showButtonAdd = false;
    this.selectedValRequest = null;
    this.principalContainers = [];
    this.periodicity = new PeriodicityModule();
    this.monetModule = new MonetizationModule();
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.dataModal.dataModal.codigoDivisa = this.getValueDivisa(this.dataModal.dataModal.codigoDivisa);
    let cpyModal = this.periodicity.deserializeControlPeriodicity(this.dataModal.dataModal, this.containers);
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    this.principalContainers = this.containers;
    this.changePeridicity(this.containers);
    this.objIds = {
      idSociedad: cpyModal.idSociedad,
      idTipoOperacion: cpyModal.idTipoOperacion,
      idSubTipoOperacion: cpyModal.idSubTipoOperacion
    }
  }

  getValueDivisa(type:string){
    let dataForm = this.containers;
    let typeMonet = "";
    dataForm.forEach((element:any) => {
      element.controls.forEach((ctrl:any) => {
        if(ctrl.controlType === 'autocomplete'){
          if(ctrl.ky === 'codigoDivisa'){
            for(let data of ctrl.content.contentList){
              if(data.value.includes(type)){
                typeMonet = data;
                break;
              }
            }
          }
        }
      });
    });
    return typeMonet;
  }

  update(){
    this.disabledFieldSociety(false);
    let cpyModal = this.reactiveForm.getDataForm(this.containers);
    cpyModal = {...cpyModal, ...this.objIds};
    cpyModal.fechaFinVigencia = this.getDateTime(cpyModal.fechaFinVigencia);
    cpyModal.fechaInicioVigencia = this.getDateTime(cpyModal.fechaInicioVigencia);
    cpyModal.emisionFactura = cpyModal.emisionFactura == true? 'true':'false';
    cpyModal.indicadorOperacion = cpyModal.indicadorOperacion == true? 'true':'false';
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    let jsonResult = this.reactiveForm.getModifyContainers(this.containers);
    if(!this.reactiveForm.principalForm?.valid || jsonResult.codigoDivisa == '' || (Date.parse(jsonResult.fechaInicioVigencia)+1) > Date.parse(jsonResult.fechaFinVigencia)){
      if( (Date.parse(jsonResult.fechaInicioVigencia)+1) > Date.parse(jsonResult.fechaFinVigencia)){
        swal.fire({
          icon: 'warning',
          title: 'Fechas de Vigencia',
          text: 'Seleccione un rango de fechas de validas.',
          heightAuto: false
        });
      }else{
        swal.fire({
          icon: 'warning',
          title: 'Campos requeridos',
          text: 'Complete los campos faltantes',
          heightAuto: false
        });
      }
      this.disabledFieldSociety(true);
      let cpyModal = this.reactiveForm.getDataForm(this.containers);
      cpyModal = {...cpyModal, ...this.objIds};
      cpyModal.fechaFinVigencia = this.getDateTime(cpyModal.fechaFinVigencia);
      cpyModal.fechaInicioVigencia = this.getDateTime(cpyModal.fechaInicioVigencia);
      this.control.setDataToControls(this.containers,cpyModal);
      this.reactiveForm.setContainers(this.containers);
      return;
    }
    // jsonResult
    var oMonet:Monetizacion =  new Monetizacion();

    oMonet.idSociedad = jsonResult.idSociedad;
    oMonet.idTipoOperacion = jsonResult.idTipoOperacion;
    oMonet.idSubTipoOperacion = jsonResult.idSubTipoOperacion;
    oMonet.segmento = parseInt(jsonResult.segmento,10);
    oMonet.tipoMontoMonetizacion = this.monetModule.getTypeOfMonetization(jsonResult.tipoMontoMonetizacion, this.containers)
    oMonet.montoMonetizacion = parseInt(jsonResult.montoMonetizacion,10);
    oMonet.idTipoImpuesto = parseInt(jsonResult.idTipoImpuesto,10);
    oMonet.codigoDivisa = this.monetModule.getDivisa(jsonResult.codigoDivisa.value);
    oMonet.emisionFactura = (jsonResult.emisionFactura =="true");
    oMonet.indicadorOperacion = jsonResult.indicadorOperacion == true ? "P" : "C";
    oMonet.periodicidadCorte = this.periodicity.getPeriodicity_insert(jsonResult, this.getDay(jsonResult.nombreDia));
    oMonet.fechaInicioVigencia = this.getDateTime(jsonResult.fechaInicioVigencia);
    oMonet.fechaFinVigencia =  this.getDateTime(jsonResult.fechaFinVigencia);
    console.log(oMonet);
    /*this.showLoader(true);
    this.accountingService.updateAccounting(oConta)
      .pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        console.log(response.code)
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
            swal.fire({
              icon: 'success',
              title: 'Solicitud correcta',
              text: response.mensaje,
              heightAuto: false,
              allowOutsideClick: false,
              confirmButtonText: "Ok"
            }).then((result)=>{
              if(result.isConfirmed){
                this.getDataTable();
              }
            });;
            break;
          case 400: //Solicitud incorrecta
            swal.fire({
              icon: 'warning',
              title: 'Solicitud incorrecta',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          case 401://No autorizado
            swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          case 500://Error Inesperado
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          default: break;
        }
      }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Por el momento no podemos proporcionar tu Solicitud.',
          heightAuto: false
        });
      });*/
  }

  getDateTime(date:string){
    var dateTime:Date = new Date(date);
    date = dateTime.getDate().toString().padStart(2,'0') + '-' + (dateTime.getMonth()+1).toString().padStart(2,'0') + "-" +  dateTime.getFullYear();
    return date;
  }

  getDataTable(){
    let oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.monetService.getDataMonetization().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
          return(
            oResponse.status = true,
            oResponse.data = response.response,
            this.refData?.close(oResponse)
          );
          case 400:
          case 401:
          case 500:
          default:
            return(
              this.refData?.close(oResponse),
              swal.fire({
                icon: 'error',
                title:'Error',
                text: 'Ocurrio un error inesperado, intente más tarde.',
                heightAuto: false
              })
            );
        }
      }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error inesperado, intente más tarde.',
          heightAuto: false
        });
      });
  }

  disabledFieldSociety(disabled:boolean){
    let element:any; let ctrl:any;
    for(element of this.containers)
      for(ctrl of element.controls) 
        if(ctrl.ky === 'idSociedad'){
          ctrl.disabled = disabled;
        }
        else if(ctrl.ky === 'idTipoOperacion'){
          ctrl.disabled = disabled;
        }
        else if(ctrl.ky === 'idSubTipoOperacion'){
          ctrl.disabled = disabled;
        }
      }

  close(){
    return( this.refData?.close());
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  getIdData(){
    let oData:{[k:string]:any}={};
    var key = this.dataModal?.keys[0];
    oData[key] = parseInt(this.dataModal?.dataModal[key],10);
    return oData;
  }

  // metodos de visibility//
  onChangeCatsPetition($event: any) {     
    if(!$event.control.visibility || $event.control.visibility.length <= 0)
    {
      return;
    }
    this.showButtonAdd = true;
    this.selectedValRequest = $event;    
    const formaux = this.reactiveForm.principalForm?.get(this.selectedValRequest.idContainer) as FormGroup;
    const selectedVal = formaux.controls[this.selectedValRequest.control.ky].value; 
    //busqueda del codigo
    if(this.selectedValRequest.control.content)
    {
      const finder = this.selectedValRequest.control.content!.options.find((option:any)=> option.ky===selectedVal);
      let valueControls = this.reactiveForm.principalForm?.value;
      this.reactiveForm.principalForm = null;
      this.containers=[];  
      this.createNewForm(
      this.selectedValRequest.control.visibility.filter((x:any) =>
        x.idOption.indexOf(finder.value.split('-')[0]) >= 0 && Number(x.visible) === 1), selectedVal, valueControls);
    }               
  }

  createNewForm(filter:any,selectedVal:any, valueControls:any)
  {
    if(filter)
    {
      this.principalContainers.forEach(pcont=>{
        const newContainer = Object.assign({}, pcont);           
        const filterControls = pcont.controls.filter(x => 
          filter.find((y:any)=> Number(y.idControl)===Number(x.idControl) && Number(y.idContainer) === Number(pcont.idContainer)));
        if(filterControls && filterControls.length>0)
        {            
          const control = newContainer.controls.find(x=>x.ky === this.selectedValRequest.control.ky);        
          if(control)
          {
            control.setAttributeValueByName('value', selectedVal);
          }
          let dataForm;
          for(var datas of Object.values(valueControls)){
            dataForm = Object(datas);
          }
          let ctrl:any;
          for(ctrl in dataForm){
            const control = newContainer.controls.find(x=>x.ky === ctrl);
            if(dataForm[ctrl] == 'undefined')
              valueCtrl = '';
            else
              var valueCtrl = dataForm[ctrl] == null? '': dataForm[ctrl];
            var as = dataForm[ctrl];
            if(typeof valueCtrl == 'boolean')
               valueCtrl = valueCtrl.toString();
            if(ctrl !== 'periodicidad')
              if(control && valueCtrl != null){
                if(control.controlType == 'dropdown' || control.controlType == 'autocomplete'){
                  control?.setAttributeValueByNameDropdown('value', valueCtrl);
                }
                else
                  control?.setAttributeValueByName('value', valueCtrl);
              }
          }
          newContainer.controls = this.sortControls(filterControls, pcont);        
          this.containers.push(newContainer);
        }
      });
    }
    this.reactiveForm.setContainers(this.containers);
  }

  sortControls(filterControls:Control[], filterCont:Container)
    {        
      return filterControls.concat(filterCont.controls.filter(x => !x.visibility)).sort((a,b)=>{
        if(a.order && b.order)
        {
          if(Number(a.order) > Number(b.order))
          {
            return 1;
          }
          if (Number(a.order) < Number(b.order))
          {
            return -1;
          }
        }
        return 0;
      });        
    }    

    changePeridicity(dataForm:any){
      var idContainer = dataForm[0].idContainer;
      dataForm.forEach((element:any) => {
        element.controls.forEach((ctrl:any) => {
          if(ctrl.controlType === 'dropdown'){
            if(ctrl.ky === 'periodicidad'){
              var selectedValRequest:any = { control: ctrl, idContainer: idContainer }
              this.onChangeCatsPetition(selectedValRequest);
            }
          }
        });
      });
    }

    getDay(type:string){
      let dataForm = this.containers;
      let typeMonet = "";
      dataForm.forEach((element:any) => {
        element.controls.forEach((ctrl:any) => {
          if(ctrl.controlType === 'dropdown'){
            if(ctrl.ky === 'nombreDia'){
              for(let data of ctrl.content.contentList){
                if(data.ky === type){
                  typeMonet = data.value;
                  break;
                }
              }
            }
          }
        });
      });
      return typeMonet;
    }
    

}
