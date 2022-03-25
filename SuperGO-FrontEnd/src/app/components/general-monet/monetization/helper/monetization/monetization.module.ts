import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import moment from 'moment';


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
    const dateTime = moment(date, 'YYYY-MM-DD');
    date = moment(date).format('YYYY-MM-DD');
    return date;
  }

  getDateTime(date: string) {
    const dateTime = moment(date, 'YYYY-MM-DD');
    date = moment(date).format('DD-MM-YYYY');
    return date;
  }

}
