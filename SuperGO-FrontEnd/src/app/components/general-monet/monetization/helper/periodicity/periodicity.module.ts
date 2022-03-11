import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PeriodicityModule { 

    getPeriodicity_show(periodicidadCorte:string){
        let descPer = periodicidadCorte.split(';');
        let periodicity:string = '';
        switch(descPer[0].split('=')[1]){
          case 'YEARLY':
            var day = descPer[1].split('=')[1];
            let month = this.getMonth(parseInt(descPer[2].split('=')[1], 10));
            periodicity = periodicity.concat(`ANUAL - CADA ${day.padStart(2,'0')} DE ${month}`);
            break;
    
          case 'MONTHLY':
            var day = descPer[1].split('=')[1];
            var numMonth = descPer[2].split('=')[1];
            periodicity = periodicity.concat(`MENSUAL - CADA ${numMonth} MES(ES) EL DIA ${day}`);
            break;
    
          case 'WEEKLY':
            var day = descPer[1].split('=')[1];
            var numWeek = descPer[2].split('=')[1];
            periodicity = periodicity.concat(`SEMANAL - CADA ${numWeek} SEMANA(S) EL DIA ${day}`);
            break;
    
          case 'DAILY':
            var day = descPer[1].split('=')[1];
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
          case '1':
            periodicity = periodicity.concat(`YEARLY;BYMONTH=${dataForm.meses};BYMONTHDAY=${dataForm.numeroDia}`);
            break;
    
          case '2':
            periodicity = periodicity.concat(`MONTHLY;BYMONTHDAY=${dataForm.numeroDia};INTERVAL=${dataForm.repetirMensual}`);
          break;
    
          case '3':
            periodicity = periodicity.concat(`WEEKLY;BYDAY=${day};INTERVAL=${dataForm.repetirSemanal}`);
            break;
    
          case '4':
            periodicity = periodicity.concat(`DAILY;INTERVAL=${dataForm.repetirDias}`);
          break;
    
          case '5':
            periodicity = periodicity.concat(`BIWEEKLY;`);
            break;
        }
        return periodicity;
      }

      deserializeControlPeriodicity(dataModal:any, dataForm:any){
        let descPer = dataModal.periodicidadCorte.split(';');
        var oNewFields:any;
        switch(descPer[0].split('=')[1]){
          case 'YEARLY':
            var day = descPer[1].split('=')[1];
            let month = descPer[2].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('ANUAL', dataForm),
              meses:month,
              numeroDia: day
            }
            break;
          case 'MONTHLY':
            var day = descPer[1].split('=')[1];
            var numMonth = descPer[2].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('MENSUAL',dataForm),
              repetirMensual:numMonth,
              numeroDia: day
            }
            break;
    
          case 'WEEKLY':
            var days = descPer[1].split('=')[1];
            var dayOfWeek = descPer[2].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('SEMANAL',dataForm),
              repetirSemanal: days,
              nombreDia: this.getDay(dayOfWeek,dataForm)
            }
            break;
    
          case 'DAILY':
            var day = descPer[1].split('=')[1];
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('DIARIA',dataForm),
              repetirDias: dayOfWeek
            }
            break;
          case 'BIWEEKLY':
            oNewFields = {
              periodicidad: this.getKeyPeriodicity('QUINCENAL',dataForm),
            }
            break;
        }
        dataModal = {...dataModal, ...oNewFields}
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
          case 1:
            monthName = 'ENERO'
            break;
          case 2:
            monthName = 'FEBRERO'
          break;
          case 3:
            monthName = 'MARZO'
          break;
          case 4:
            monthName = 'ABRIL'
          break;
          case 5:
            monthName = 'MAYO'
          break;
          case 6:
            monthName = 'JUNIO'
          break;
          case 7:
            monthName = 'JULIO'
          break;
          case 8:
            monthName = 'AGOSTO'
          break;
          case 9:
            monthName = 'SEPTIEMBRE'
          break;
          case 10:
            monthName = 'OCTUBRE'
          break;
          case 11:
            monthName = 'NOVIEMBRE'
          break;
          case 12:
            monthName = 'DICIEMBRE'
            break;
        }
        return monthName;
      }
}