import {CurrencyPipe} from '@angular/common';
import { ServiceNoMagicNumber } from '../ServiceResponseCodes/service-response-codes.model';
export class ControlDecimal {

    private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber(); 
    private currencyPipe:CurrencyPipe = new CurrencyPipe('en-US');

    obtenerStrSinFormato(input:string): string {        
        if (input.indexOf('$') !== -1) {
            let regex2CerosDespuesPuntoDecimal = new RegExp(/(\d+)(\.00)/g);
            let valorDecimal= input.replace(/[$,]/g, '');
            if(regex2CerosDespuesPuntoDecimal.test(valorDecimal)) {
                return valorDecimal.substring(0,valorDecimal.length-(Number(this.codeResponseMagic.RESPONSE_CODE_3)));
              } else {
                  return valorDecimal;
              }
        }
        
        return '';
    }

    obtenerStrConFormato(input:any):any{
        let valor = input.toString().replace(/[$,]/g, '');
        if (!isNaN(valor) && parseFloat(valor)>0)
        {
          valor = this.currencyPipe.transform(valor, 'USD', true, '1.2');          
          return valor;
        }

        return null;
    }
    
}
