import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitCamelCase'
})
export class SplitCamelCasePipe implements PipeTransform {

  transform(value: string): any {
    if ((typeof value) !== 'string') {
        return value;
        }

        value = value.split(/(?=[A-Z])/).join(' ');       
        value = value.toUpperCase();
        return value;
  }

}