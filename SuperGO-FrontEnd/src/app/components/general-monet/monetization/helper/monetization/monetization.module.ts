import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MonetizationModule { 

  getTypeOfMonetization(type:string, dataForm:Container[]){
    let typeMonet = '';
    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.controlType === 'dropdown' && ctrl.ky === 'tipoMontoMonetizacion' && ctrl.content){
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
    return arrDivisa.replace(')', '');;
  }

}
