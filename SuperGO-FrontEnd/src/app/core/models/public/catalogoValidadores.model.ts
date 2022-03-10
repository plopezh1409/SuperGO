import { Validators } from '@angular/forms';

export function RequireMatch(control: any) {
  const selection: any = control.value;
  if (typeof selection === 'string') {
      return { incorrect: true };
  }
  return null;
}

export class CatalogoValidadores {
  obtenerValidadores(input: string[], control: any) : any[] {
    let validaciones:any[] = []
    input.forEach((val) => {
      switch (val) {
        case 'Validators.required':
          validaciones.push(Validators.required);
          if(control.controlType!=='autocomplete')
          {
            validaciones.push(RequireMatch);  
          }
          break;
        case 'Validators.min':
          validaciones.push(Validators.min(control.min!));
          break;
        case 'Validators.required':
          validaciones.push(Validators.max(control.max! || 0));
          break;
        case 'Validators.maxlenght':
          if(control.controlType! !== "texboxLink") {
            validaciones.push(Validators.maxLength(control.maxLength!));
          }
          break;
        case 'Validators.minlength':
          if(control.controlType! !== "textboxLink") {
            validaciones.push(Validators.minLength(control.minlength!));
          }
          break;
        case 'Validators.email':
          validaciones.push(Validators.email);
          break;
        case 'Validators.pattern':
          validaciones.push(Validators.pattern(control.patron));
          break;        
      }
    });
    return validaciones
  }
}