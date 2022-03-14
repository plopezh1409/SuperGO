import { Pipe, PipeTransform } from '@angular/core';
import { ServiceNoMagigNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import moment from 'moment';

@Pipe({
  name: 'FechaNombreMes'
})
export class FechaNombreMesPipe implements PipeTransform {

  private readonly codeResponseMagic: ServiceNoMagigNumber = new ServiceNoMagigNumber(); 

  transform(value: any): any {         
    if (value) {
        let nuevaFecha ='';
        let fecha = moment(value, 'DD/MM/YYYY');
        let dia   = fecha.format('DD');
        let mes = fecha.format('MM');        
        let anio  = fecha.format('YYYY');        
        switch(Number(mes))
        {
            case this.codeResponseMagic.NoMagigNumber_1: 
            nuevaFecha = 'ENE';
            break;
            case this.codeResponseMagic.NoMagigNumber_2: 
            nuevaFecha = 'FEB';
            break;
            case this.codeResponseMagic.NoMagigNumber_3: 
            nuevaFecha = 'MAR';
            break;
            case this.codeResponseMagic.NoMagigNumber_4: 
            nuevaFecha = 'ABR';
            break;
            case this.codeResponseMagic.NoMagigNumber_5: 
            nuevaFecha = 'MAY';
            break;
            case this.codeResponseMagic.NoMagigNumber_6: 
            nuevaFecha = 'JUN';
            break;
            case this.codeResponseMagic.NoMagigNumber_7: 
            nuevaFecha = 'JUL';
            break;
            case this.codeResponseMagic.NoMagigNumber_8: 
            nuevaFecha = 'AGO';
            break;
            case this.codeResponseMagic.NoMagigNumber_9: 
            nuevaFecha = 'SEP';
            break;
            case this.codeResponseMagic.NoMagigNumber_10: 
            nuevaFecha = 'OCT';
            break;            
            case this.codeResponseMagic.NoMagigNumber_11: 
            nuevaFecha = 'NOV';
            break;
            case this.codeResponseMagic.NoMagigNumber_12: 
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