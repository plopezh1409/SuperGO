import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'FechaNombreMes'
})
export class FechaNombreMesPipe implements PipeTransform {


  transform(value: any): any {         
    if (value) {
        let nuevaFecha ='';
        let fecha = moment(value, 'DD/MM/YYYY');
        let dia   = fecha.format('DD');
        let mes = fecha.format('MM');        
        let anio  = fecha.format('YYYY');        
        switch(Number(mes))
        {
            case 1: 
            nuevaFecha = 'ENE';
            break;
            case 2: 
            nuevaFecha = 'FEB';
            break;
            case 3: 
            nuevaFecha = 'MAR';
            break;
            case 4: 
            nuevaFecha = 'ABR';
            break;
            case 5: 
            nuevaFecha = 'MAY';
            break;
            case 6: 
            nuevaFecha = 'JUN';
            break;
            case 7: 
            nuevaFecha = 'JUL';
            break;
            case 8: 
            nuevaFecha = 'AGO';
            break;
            case 9: 
            nuevaFecha = 'SEP';
            break;
            case 10: 
            nuevaFecha = 'OCT';
            break;            
            case 11: 
            nuevaFecha = 'NOV';
            break;
            case 12: 
            nuevaFecha = 'DIC';
            break;
        }
        nuevaFecha = `${dia}\\${nuevaFecha}\\${anio}` ;
      return nuevaFecha;
    } else {
      return value;
    }
  }

}