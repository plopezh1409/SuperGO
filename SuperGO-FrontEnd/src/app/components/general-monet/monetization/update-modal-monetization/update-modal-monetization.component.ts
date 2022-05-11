import { Component,Inject, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//Models
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { PeriodicityModule } from '../helper/periodicity/periodicity.module';
import { MonetizationModule } from '../helper/monetization/monetization.module';
//Servicio
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';

import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceNoMagicNumber, ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import { MonetizationResponse } from '@app/core/models/ServiceResponseData/monetization-response.model';
import { DropdownEvent } from '@app/core/models/capture/dropdown-event.model';

@Component({
  selector: 'app-update-modal-monetization',
  templateUrl: './update-modal-monetization.component.html',
  styleUrls: ['./update-modal-monetization.component.sass']
})

export class UpdateModalMonetizationComponent implements OnInit {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  monetService:FormMonetizationsService;
  reactiveForm:ReactiveForm;
  messageError: MessageErrorModule;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  public showLoad: boolean;
  private readonly loaderDuration: number;
  public showButtonAdd: boolean;
  private selectedValRequest: DropdownEvent;
  public principalContainers: Container[];
  private readonly periodicity:PeriodicityModule;
  private readonly monetModule:MonetizationModule;
  private objIds:any;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,private readonly injector:Injector,
      public refData?:MatDialogRef<UpdateModalMonetizationComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.messageError = new MessageErrorModule();
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
    this.showButtonAdd = false;
    this.selectedValRequest = new DropdownEvent();
    this.principalContainers = [];
    this.showLoad = false;
    this.periodicity = new PeriodicityModule();
    this.monetModule = new MonetizationModule();
    this.objIds = {
      idSociedad: 0,
      idTipo: 0,
      idSubtipo: 0,
      idReglaMonetizacion:0
    };
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.dataModal.dataModal.codigoDivisa = this.getValueDivisa(this.dataModal.dataModal.codigoDivisa);
    const cpyModal = this.periodicity.deserializeControlPeriodicity(this.dataModal.dataModal, this.containers);
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    this.principalContainers = this.containers;
    this.changePeridicity(this.containers);
    this.objIds = {
      idSociedad: cpyModal.idSociedad,
      idTipo: cpyModal.idTipo,
      idSubtipo: cpyModal.idSubtipo,
      idReglaMonetizacion: cpyModal.idReglaMonetizacion
    };
  }

  getValueDivisa(type:string){
    const dataForm = this.containers;
    let typeMonet = '';
    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.controlType === 'autocomplete' && ctrl.ky === 'codigoDivisa' && ctrl.content){
          for(const data of ctrl.content.contentList){
            if(data.value.includes(type)){
              typeMonet = data;
              break;
            }
          }
        }
      });
    });
    return typeMonet;
  }

  update(){
    this.disabledFields(false);
    const cpyModal = { ...this.reactiveForm.getDataForm(this.containers), ...this.objIds};
    cpyModal.fechaFin = this.monetModule.getDateTime(cpyModal.fechaFin);
    cpyModal.fechaInicio = this.monetModule.getDateTime(cpyModal.fechaInicio);
    cpyModal.emisionFactura = cpyModal.emisionFactura === true? 'true':'false';
    cpyModal.indicadorOperacion = cpyModal.indicadorOperacion === true? 'true':'false';
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    const jsonResult = this.reactiveForm.getModifyContainers(this.containers);
    if(!this.reactiveForm.principalForm?.valid || jsonResult.codigoDivisa === '' || (Date.parse(jsonResult.fechaInicio)) > Date.parse(jsonResult.fechaFin)){
      if( (Date.parse(jsonResult.fechaInicio)) > Date.parse(jsonResult.fechaFin)){
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
      this.restoreFields();
      return;
    }
    const oMonet:Monetizacion =  new Monetizacion();
    oMonet.idSociedad = jsonResult.idSociedad;
    oMonet.idTipo = this.objIds.idTipo;
    oMonet.idSubtipo = this.objIds.idSubtipo;
    oMonet.segmento = parseInt(jsonResult.segmento,10);
    oMonet.tipoMonto = this.monetModule.getTypeOfMonetization(jsonResult.tipoMonto, this.containers);
    oMonet.montoMonetizacion = parseFloat(jsonResult.montoMonetizacion.toString().replace(/[$\s,]/g, ''));
    oMonet.idTipoImpuesto = parseInt(jsonResult.idTipoImpuesto,10);
    oMonet.codigoDivisa = this.monetModule.getDivisa(jsonResult.codigoDivisa.value);
    oMonet.emisionFactura = (jsonResult.emisionFactura === 'true');
    oMonet.indicador = jsonResult.indicador === true ? 'P' : 'C';
    oMonet.periodicidadCorte = this.periodicity.getPeriodicity_insert(jsonResult, jsonResult.nombreDia);
    oMonet.fechaInicio = this.monetModule.getDateTimeReverse(jsonResult.fechaInicio);
    oMonet.fechaFin =  this.monetModule.getDateTimeReverse(jsonResult.fechaFin);
    oMonet.referenciaPago = jsonResult.referenciaPago;
    oMonet.idReglaMonetizacion = this.objIds.idReglaMonetizacion;
    this.showLoader(true);
    this.monetService.updateMonetization(oMonet).pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<GenericResponse>) => {
      if(response.code === this.codeResponse.RESPONSE_CODE_200){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: response.message.toString(),
          heightAuto: false,
          allowOutsideClick: false,
          confirmButtonText: 'Ok'
        }).then((result)=>{
          if(result.isConfirmed){
            this.getDataTable();
          }
        });
      }
      else{
        this.restoreFields();
        this.messageError.showMessageError(response.message.toString(), response.code);
      }
    }, (err) => {
      this.restoreFields();
        swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Por el momento no podemos proporcionar tu Solicitud.',
          heightAuto: false
        });
      });
  }

  getDataTable(){
    const oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.monetService.getDataMonetization().pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<MonetizationResponse>) => {
        switch (response.code) {
          case this.codeResponse.RESPONSE_CODE_200:
            oResponse.status = true;
            oResponse.data = this.monetModule.orderDate(response.response.reglas);
          return(
            this.refData?.close(oResponse)
          );
          case this.codeResponse.RESPONSE_CODE_400:
          case this.codeResponse.RESPONSE_CODE_401:
          case this.codeResponse.RESPONSE_CODE_404:
          case this.codeResponse.RESPONSE_CODE_500:
            return(
              this.refData?.close(oResponse),
              swal.fire({
                icon: 'error',
                title:'Error',
                text: 'Ocurrio un error inesperado, intente más tarde.',
                heightAuto: false
              })
            );
          default:
            break;
        }
      }, () => {
        return(
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error inesperado, intente más tarde.',
          heightAuto: false
        })
        );
      });
  }

  disabledFields(disabled:boolean){
    this.containers.forEach((cont: Container) => {
      cont.controls.forEach((ctrl:Control) => {
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipo' || ctrl.ky === 'idSubtipo'){
          ctrl.disabled = disabled;
        }
      });
    });
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

  // metodos de visibility//
  onChangeCatsPetition($event: DropdownEvent) {     
    if(!$event.control.visibility || $event.control.visibility.length <= 0)
    {
      return;
    }
    this.showButtonAdd = true;
    this.selectedValRequest = $event;    
    const formaux = this.reactiveForm.principalForm?.get(this.selectedValRequest.idContainer) as FormGroup;
    const selectedVal = formaux.controls[this.selectedValRequest.control.ky!].value; 
    //busqueda del codigo
    if(this.selectedValRequest.control.content)
    {
      const finder = this.selectedValRequest.control.content.options.find((option:any)=> option.ky===selectedVal);
      let dataForm:Object={};
      for (const datas of Object.values(this.reactiveForm.principalForm?.value)) {
        dataForm = Object(datas);
      }
      this.reactiveForm.principalForm = null;
      this.containers=[];  
      this.createNewForm(
      this.selectedValRequest.control.visibility!.filter((x:any) =>
        x.idOption.indexOf(finder.value.split('-')[0]) >= 0 && Number(x.visible) === 1), selectedVal, dataForm);
    }               
  }

  createNewForm(filter:any,selectedVal:any, dataForm:Object)
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
          this.setControls(dataForm, newContainer);
          newContainer.controls = this.sortControls(filterControls, pcont);        
          this.containers.push(newContainer);
        }
      });
    }
    this.reactiveForm.setContainers(this.containers);
  }

  setControls(dataForm:{}, newContainer:Container){
    for(const ctrl in dataForm){
      const control = newContainer.controls.find(x=>x.ky === ctrl);
      const valueCtrl = dataForm[ctrl as keyof typeof dataForm] === 'undefined'? '' : dataForm[ctrl as keyof typeof dataForm] === null? '': dataForm[ctrl as keyof typeof dataForm];
      if(control && valueCtrl != null && ctrl !== 'periodicidad'){
        if(control.controlType === 'dropdown' || control.controlType === 'autocomplete'){
          control.setAttributeValueByNameDropdown('value', valueCtrl);
        }
        else{
          control.setAttributeValueByName('value', valueCtrl);
        }
      }
    }
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

    changePeridicity(dataForm:Container[]){
      const idContainer = dataForm[0].idContainer;
      dataForm.forEach((element:Container) => {
        element.controls.forEach((ctrl:Control) => {
          if(ctrl.controlType === 'dropdown' && ctrl.ky === 'periodicidad'){
            const selectedRequest = {
              control: ctrl,
              idContainer
            };
            this.onChangeCatsPetition(selectedRequest);
          }
        });
      });
    }

    getDay(type:string){
      let typeMonet = '';
      this.containers.forEach((element:Container) => {
        element.controls.forEach((ctrl:Control) => {
          if(ctrl.controlType === 'dropdown' && ctrl.ky === 'nombreDia' && ctrl.content){
            for(const data of ctrl.content.contentList){
              if(data.ky === type){
                typeMonet = data.value;
                break;
              }
            }
          }
        });
      });
      return typeMonet;
    }

    restoreFields(){
      this.disabledFields(true);
      const cpyModal = { ...this.reactiveForm.getDataForm(this.containers), ...this.objIds};
      cpyModal.fechaFin = this.monetModule.getDateTime(cpyModal.fechaFin);
      cpyModal.fechaInicio = this.monetModule.getDateTime(cpyModal.fechaInicio);
      this.control.setDataToControls(this.containers,cpyModal);
      this.reactiveForm.setContainers(this.containers);
    }
    

}
