import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MonetizationModule { 

  getTypeOfMonetization(type:string, dataForm:any){
    let typeMonet = '';
    dataForm.forEach((element:any) => {
      element.controls.forEach((ctrl:any) => {
        if(ctrl.controlType === 'dropdown'){
          if(ctrl.ky === 'tipoMontoMonetizacion'){
            for(let data of ctrl.content.contentList){
              if(data.ky === type)
                typeMonet = data.value.charAt(0);
            }
          }
        }
      });
    });
    return typeMonet;
  }
  
  getDivisa(divisa:string){
    let arrDivisa = divisa.split('(')[1];
    return arrDivisa.replace(')', '');;
  }

}
