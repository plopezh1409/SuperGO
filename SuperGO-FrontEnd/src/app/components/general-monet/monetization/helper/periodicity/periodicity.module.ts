import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PeriodicityModule { 
  private readonly codeResponse: ServiceNoMagicNumber = new ServiceNoMagicNumber();

    getPeriodicity_show(periodicidadCorte:string){
        const descPer = periodicidadCorte.split(';');
        let periodicity = '';
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
            day = this.getDayShow(day);
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
        let periodicity = 'FREQ=';
        switch(parseInt(dataForm.periodicidad,10)){
          case this.codeResponse.RESPONSE_CODE_1:
            periodicity = periodicity.concat(`YEARLY;BYMONTH=${dataForm.meses};BYMONTHDAY=${dataForm.numeroDia}`);
            break;
    
          case this.codeResponse.RESPONSE_CODE_2:
            periodicity = periodicity.concat(`MONTHLY;BYMONTHDAY=${dataForm.numeroDia};INTERVAL=${dataForm.repetirMensual}`);
          break;
    
          case this.codeResponse.RESPONSE_CODE_3:
            day = this.getDayInsert(parseInt(day));
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

      deserializeControlPeriodicity(dataModal:any, dataForm:Container[]){
        const descPer = dataModal.periodicidadCorte.split(';');
        let oNewFields:{} = {};
        let day;
        switch(descPer[0].split('=')[1]){
          case 'YEARLY':
            day = descPer[1].split('=')[1];
            const month = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('ANUAL', dataForm),
              meses:month,
              numeroDia: day
            };
            break;
          case 'MONTHLY':
            day = descPer[1].split('=')[1];
            const numMonth = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('MENSUAL',dataForm),
              repetirMensual:numMonth,
              numeroDia: day
            };
            break;
    
          case 'WEEKLY':
            day = this.getDayShow(descPer[1].split('=')[1]);
            let dayOfWeek = descPer[Number(this.codeResponse.RESPONSE_CODE_2)].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('SEMANAL',dataForm),
              repetirSemanal: dayOfWeek,
              nombreDia: this.getDayDropdown(day,dataForm)
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

      getKeyPeriodicity(frequency:string, dataForm:Container[]){
        let ky = '';
        dataForm.forEach((element:Container) => {
          element.controls.forEach((ctrl:Control) => {
            if(ctrl.controlType === 'dropdown' && ctrl.ky === 'periodicidad' && ctrl.content){
              for(const data of ctrl.content.contentList){
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

      getDayDropdown(day:string, dataForm:Container[]){
        let kyDay = '';
        dataForm.forEach((element:Container) => {
          element.controls.forEach((ctrl:Control) => {
            if(ctrl.controlType === 'dropdown' && ctrl.ky === 'nombreDia' && ctrl.content){
              for(const data of ctrl.content.contentList){
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
        let monthName = '';
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

      getDayInsert(day:number){
        let dayName = '';
        switch(day){
          case this.codeResponse.RESPONSE_CODE_1:
            dayName = 'MO';
            break;
          case this.codeResponse.RESPONSE_CODE_2:
            dayName = 'TU';
          break;
          case this.codeResponse.RESPONSE_CODE_3:
            dayName = 'WE';
          break;
          case this.codeResponse.RESPONSE_CODE_4:
            dayName = 'TH';
          break;
          case this.codeResponse.RESPONSE_CODE_5:
            dayName = 'FR';
          break;
          case this.codeResponse.RESPONSE_CODE_6:
            dayName = 'SA';
          break;
          case this.codeResponse.RESPONSE_CODE_7:
            dayName = 'SU';
          break;
        }
        return dayName;
      }

      getDayShow(day:string){
        let dayName = '';
        switch(day){
          case 'MO':
            dayName = 'LUNES';
            break;
          case 'TU':
            dayName = 'MARTES';
          break;
          case 'WE':
            dayName = 'MIERCOLES';
          break;
          case 'TH':
            dayName = 'JUEVES';
          break;
          case 'FR':
            dayName = 'VIERNES';
          break;
          case 'SA':
            dayName = 'SABADO';
          break;
          case 'SU':
            dayName = 'DOMINGO';
          break;
        }
        return dayName;
      }
}