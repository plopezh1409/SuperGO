import { Pipe, PipeTransform } from '@angular/core';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import moment from 'moment';

@Pipe({
  name: 'FechaNombreMes'
})
export class FechaNombreMesPipe implements PipeTransform {

  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber(); 

  transform(value: any): any {         
    if (value) {
        let nuevaFecha ='';
        let fecha = moment(value, 'DD/MM/YYYY');
        let dia   = fecha.format('DD');
        let mes = fecha.format('MM');        
        let anio  = fecha.format('YYYY');        
        switch(Number(mes))
        {
            case this.codeResponseMagic.RESPONSE_CODE_1: 
            nuevaFecha = 'ENE';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_2: 
            nuevaFecha = 'FEB';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_3: 
            nuevaFecha = 'MAR';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_4: 
            nuevaFecha = 'ABR';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_5: 
            nuevaFecha = 'MAY';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_6: 
            nuevaFecha = 'JUN';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_7: 
            nuevaFecha = 'JUL';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_8: 
            nuevaFecha = 'AGO';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_9: 
            nuevaFecha = 'SEP';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_10: 
            nuevaFecha = 'OCT';
            break;            
            case this.codeResponseMagic.RESPONSE_CODE_11: 
            nuevaFecha = 'NOV';
            break;
            case this.codeResponseMagic.RESPONSE_CODE_12: 
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