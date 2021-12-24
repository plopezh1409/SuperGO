import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscadorRutas'
})
export class BuscadorRutasPipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter((val: any) => val.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }

}