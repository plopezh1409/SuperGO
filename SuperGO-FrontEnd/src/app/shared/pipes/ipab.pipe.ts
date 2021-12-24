import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markIPAB'
})
export class IPABPipe implements PipeTransform {

  transform(value: string): any {
    if ((typeof value) !== 'string') {
        return value;
        }        

        switch(value)
        {
            case 'M':value = 'MARCADO'; break;
            case 'D':value = 'DESMARCADO'; break;
            case 'S':value = 'SIN MARCAJE'; break;
            default:
              break;
        }
                
        return value;
  }

}