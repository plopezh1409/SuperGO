import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import moment from 'moment';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { DropdownModel } from '@app/core/models/dropdown/dropdown.model';
import { MonetizationRules } from '@app/core/models/ServiceResponseData/monetization-response.model';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MonetizationModule { 
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();

  getTypeOfMonetization(type:string, dataForm:Container[]){
    let typeMonet = '';
    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.controlType === 'dropdown' && ctrl.ky === 'tipoMonto' && ctrl.content){
          for(const data of ctrl.content.contentList){
            if(data.ky === type){
              typeMonet = data.value.charAt(0);
            }
          }
        }
      });
    });
    return typeMonet;
  }
  
  getDivisa(divisa:string){
    const arrDivisa = divisa.split('(')[1];
    return arrDivisa.replace(')', '');
  }

  getDateTimeReverse(date: string) {
    date = moment(date).format('YYYY-MM-DD');
    return date;
  }

  getDateTime(date: string) {
    date = moment(date).format('DD-MM-YYYY');
    return date;
  }

  getDateTimeSlash(date: string) {
    date = moment(date).format('DD/MM/YYYY');
    return date;
  }

  orderDate(reglas:Monetizacion[]){
    reglas.forEach(oData => {
      oData.fechaInicio = moment(oData.fechaInicio).format('DD/MM/YYYY');
      oData.fechaFin = moment(oData.fechaFin).format('DD/MM/YYYY');
    });
    return reglas;
  }

  addDataControlMonetization(dataForm: Container[], reglasMonetizacion: MonetizationRules[]){
    const dropdownList:DropdownModel[] = [];
    reglasMonetizacion.forEach((monet:MonetizationRules) => {
      const dropdownData: DropdownModel = new DropdownModel();
      dropdownData.ky = monet.idReglaMonetizacion;
      dropdownData.value = monet.descReglaMonetizacion.toString();
      dropdownList.push(dropdownData);
    });
  
    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.controlType === 'dropdown' && ctrl.content){
          if(ctrl.ky === 'idReglaMonetizacion' ){
            ctrl.content.contentList = dropdownList;
            ctrl.content.options = dropdownList;
          }
        }
      });
    });
    return dataForm;
  }

  setControlsIdRegla(dataForm:any, newContainer:Container){
    for (const ctrl in dataForm) {
      const control = newContainer.controls.find((x:Control) => x.ky === ctrl);
      let valueCtrl = dataForm[ctrl] === null ? '' : dataForm[ctrl];
      valueCtrl = typeof valueCtrl === 'boolean'? valueCtrl.toString(): valueCtrl;
        if (control && valueCtrl !== '' && ctrl !== 'idReglaMonetizacion') {
          if (control.controlType === 'dropdown' || control.controlType === 'autocomplete') {
            control.setAttributeValueByNameDropdown('value', valueCtrl);
          }
          else{
            control.setAttributeValueByName('value', valueCtrl);
          }
        }
        else if(control && valueCtrl !== '' && ctrl === 'idReglaMonetizacion'){
          control.setAttributeValueByNameDropdown('value', '');
        }
        else{

        }
    }
    return newContainer;
  }

}
