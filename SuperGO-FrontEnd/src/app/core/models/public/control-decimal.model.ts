import {CurrencyPipe} from '@angular/common'
export class ControlDecimal {

    private currencyPipe:CurrencyPipe = new CurrencyPipe('en-US');

    obtenerStrSinFormato(input:string): string {        
        if (input.indexOf('$') !== -1) {
            let regex2CerosDespuesPuntoDecimal = new RegExp(/(\d+)(\.00)/g);
            let valorDecimal= input.replace(/[$,]/g, '');
            if(regex2CerosDespuesPuntoDecimal.test(valorDecimal)) {
                return valorDecimal.substring(0,valorDecimal.length-3);
              } else {
                  return valorDecimal;
              }
        }
        
        return '';
    }

    obtenerStrConFormato(input:any):any{
        let valor = input.replace(/[$,]/g, '');
        if (!isNaN(valor) && parseFloat(valor)>0)
        {
          valor = this.currencyPipe.transform(valor, 'USD', true, '1.2');          
          return valor;
        }

        return null;
    }
    
}
