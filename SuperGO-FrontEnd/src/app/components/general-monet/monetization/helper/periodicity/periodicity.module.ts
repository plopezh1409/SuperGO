import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PeriodicityModule { 
  private readonly codeResponse: ServiceNoMagicNumber = new ServiceNoMagicNumber();
    getPeriodicity_show(periodicidadCorte:string){
        let descPer;
        descPer = periodicidadCorte.split(';');
        let periodicity;
        periodicity = '';
        let day;
        let numMonth;
        let numWeek;
        let month;
        switch(descPer[0].split('=')[1]){
          case 'YEARLY':
           
            day = descPer[1].split('=')[1];
            
            month = this.getMonth(parseInt(descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1], 10));
            periodicity = periodicity.concat(`ANUAL - CADA ${day.padStart(Number(this.codeResponse.RESPONSE_CODE_2),'0')} DE ${month}`);
            break;
    
          case 'MONTHLY':
            day = descPer[1].split('=')[1];
            numMonth = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            periodicity = periodicity.concat(`MENSUAL - CADA ${numMonth} MES(ES) EL DIA ${day}`);
            break;
    
          case 'WEEKLY':
            day = descPer[1].split('=')[1];
            numWeek = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            periodicity = periodicity.concat(`SEMANAL - CADA ${numWeek} SEMANA(S) EL DIA ${day}`);
            break;
    
          case 'DAILY':
            day = descPer[1].split('=')[1];
            periodicity = periodicity.concat(`DIARIO - CADA ${day} DIA(S)`);
          break;
    
          case 'BIWEEKLY':
            periodicity = periodicity.concat(`QUINCENAL`);
            break;
        }
        return periodicity;
      }


      getPeriodicity_insert(dataForm:any, day:string){
        let periodicity:string = 'FREQ=';
        switch(dataForm.periodicidad){
          case this.codeResponse.RESPONSE_CODE_1:
            periodicity = periodicity.concat(`YEARLY;BYMONTH=${dataForm.meses};BYMONTHDAY=${dataForm.numeroDia}`);
            break;
    
          case this.codeResponse.RESPONSE_CODE_2:
            periodicity = periodicity.concat(`MONTHLY;BYMONTHDAY=${dataForm.numeroDia};INTERVAL=${dataForm.repetirMensual}`);
          break;
    
          case this.codeResponse.RESPONSE_CODE_3:
            periodicity = periodicity.concat(`WEEKLY;BYDAY=${day};INTERVAL=${dataForm.repetirSemanal}`);
            break;
    
          case this.codeResponse.RESPONSE_CODE_4:
            periodicity = periodicity.concat(`DAILY;INTERVAL=${dataForm.repetirDias}`);
          break;
    
          case this.codeResponse.RESPONSE_CODE_5:
            periodicity = periodicity.concat(`BIWEEKLY;`);
            break;
        }
        return periodicity;
      }

      deserializeControlPeriodicity(dataModal:any, dataForm:any){
        let descPer; 
        descPer = dataModal.periodicidadCorte.split(';');
        let oNewFields:any;
        
        switch(descPer[0].split('=')[1]){
          case 'YEARLY':
            let month;
            let day;
            day = descPer[1].split('=')[1];
            month = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('ANUAL', dataForm),
              meses:month,
              numeroDia: day
            };
            break;
          case 'MONTHLY':
            day = descPer[1].split('=')[1];
            let numMonth = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('MENSUAL',dataForm),
              repetirMensual:numMonth,
              numeroDia: day
            };
            break;
    
          case 'WEEKLY':
            day = descPer[1].split('=')[1];
            let dayOfWeek;
            dayOfWeek = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('SEMANAL',dataForm),
              repetirSemanal: day,
              nombreDia: this.getDay(dayOfWeek,dataForm)
            };
            break;
    
          case 'DAILY':
            day = descPer[1].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('DIARIA',dataForm),
              repetirDias: dayOfWeek
            };
            break;
          case 'BIWEEKLY':
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('QUINCENAL',dataForm),
            };
            break;
        }
        dataModal = {...dataModal, ...oNewFields};
        return dataModal;
      }

      getKeyPeriodicity(frequency:string, dataForm:any){
        let ky:string = '';
        dataForm.forEach((element:any) => {
          element.controls.forEach((ctrl:any) => {
            if(ctrl.controlType === 'dropdown' && ctrl.ky === 'periodicidad'){
              let data:any;
              for(data of ctrl.content.contentList){
                if(data.value.includes(frequency)){
                  ky = data.ky;
                  break;
                }
              }
            }
          });
        });
        return ky;
      }

      getDay(day:string, dataForm:any){
        let kyDay = '';
        dataForm.forEach((element:any) => {
          element.controls.forEach((ctrl:any) => {
            if(ctrl.controlType === 'dropdown' && ctrl.ky === 'nombreDia'){
              for(let data of ctrl.content.contentList){
                if(data.value === day){
                  kyDay = data.ky;
                  break;
                }
              }
            }
          });
        });
        return kyDay;
      }

      getMonth(month:number){
        let monthName:string = '';
        switch(month){
          case this.codeResponse.RESPONSE_CODE_1:
            monthName = 'ENERO';
            break;
          case this.codeResponse.RESPONSE_CODE_2:
            monthName = 'FEBRERO';
          break;
          case this.codeResponse.RESPONSE_CODE_3:
            monthName = 'MARZO';
          break;
          case this.codeResponse.RESPONSE_CODE_4:
            monthName = 'ABRIL';
          break;
          case this.codeResponse.RESPONSE_CODE_5:
            monthName = 'MAYO';
          break;
          case this.codeResponse.RESPONSE_CODE_6:
            monthName = 'JUNIO';
          break;
          case this.codeResponse.RESPONSE_CODE_7:
            monthName = 'JULIO';
          break;
          case this.codeResponse.RESPONSE_CODE_8:
            monthName = 'AGOSTO';
          break;
          case this.codeResponse.RESPONSE_CODE_9:
            monthName = 'SEPTIEMBRE';
          break;
          case this.codeResponse.RESPONSE_CODE_10:
            monthName = 'OCTUBRE';
          break;
          case this.codeResponse.RESPONSE_CODE_11:
            monthName = 'NOVIEMBRE';
          break;
          case this.codeResponse.RESPONSE_CODE_12:
            monthName = 'DICIEMBRE';
            break;
        }
        return monthName;
      }
}