import { Directive, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Mask } from '@app/core/models/capture/mask.model';
import { CatalogoValidadores } from '@app/core/models/public/catalogoValidadores.model';
import { ControlDecimal } from '@app/core/models/public/control-decimal.model';
import { ServiceNoMagigNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Directive({
  selector: '[mask]',
})
export class MaskDirective {

  private readonly codeResponseMagic: ServiceNoMagigNumber = new ServiceNoMagigNumber(); 
  private valorAnterior: string;
  private regExpr: any;
  private maskDecimal: ControlDecimal;
  private controlesBackEnd: any;
  private validaciones;
  private regexString = '';

  @Optional() private control: NgControl;
  @Input() set mask(obj: Mask) {
    if (obj) {
      this.regexString = obj.regex;
      this.regExpr = new RegExp(obj.regex);
      this.controlesBackEnd = obj.controles;
    }
  }

  constructor(control: NgControl) {
    this.valorAnterior = '';
    this.control = control;
    this.maskDecimal = new ControlDecimal();
    this.validaciones = new CatalogoValidadores();
  }

  @HostListener('focus', ['$event'])
  onFocus($event: any) {
    if(this.controlesBackEnd){
      if (this.controlesBackEnd.controlType === 'decimal') {
        if (this.control.control) {
          this.control.control.setValue(this.maskDecimal.obtenerStrSinFormato($event.target.value));
        }
      }
    }
    
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    if(this.controlesBackEnd && this.controlesBackEnd.controlType === 'decimal')
    {      
      let valorConFormato = this.maskDecimal.obtenerStrConFormato($event.target.value);
      let clonValidadores = [...this.controlesBackEnd.validations.filter((x: any) => { return x.validate != 'pattern' })];
      let validadoresDeCatalogo = this.controlesBackEnd.configValidators(clonValidadores);
      if (this.control.control) {
        this.control.control.setValidators(validadoresDeCatalogo);
        if (valorConFormato) {
          this.control.control.setValue(valorConFormato);
        }
        else if (!isNaN($event.target.value)) {
          this.control.control.setValue($event.target.value);
        }
        else {
          this.control.control.setValue('');
        }

        this.control.control.updateValueAndValidity();

      }      
    }    
  }

  @HostListener('input', ['$event'])
  change($event: any): void {
    let type = this.controlesBackEnd? this.controlesBackEnd.getAttributeValueByName('type') : null;
    if (type === 'mask') {
      if (this.controlesBackEnd.ky.indexOf('RFC') > -1 || this.controlesBackEnd.ky.indexOf('CURP') > -1) {
        this.regExpr = new RegExp('^[a-zA-Z0-9]+$');
        this.validarRegexYEscribirEnInput($event);
        if (this.regExpr.test($event.target.value) && this.control.control) {
          this.control.control.setValue($event.target.value.toUpperCase());
        }
      }
    }
    else {
      this.validarRegexYEscribirEnInput($event);
    }
  }

  validarRegexYEscribirEnInput($event: any) {    
    let elemento: any;
    let valor: any;
    let pos: any;
    elemento = $event.target;
    valor = elemento.value;
    pos = elemento.selectionStart;
    if ($event.target.value.length == 1 && !this.regExpr.test(elemento.value))
    {
      this.valorAnterior = '';
      elemento.value = '';
    }
    if (valor && !this.regExpr.test(elemento.value)) 
    {
      elemento.selectionStart = elemento.selectionEnd = pos - 1;
      if (elemento.value.length < this.valorAnterior.length && pos === 0) {
        pos = this.codeResponseMagic.NoMagigNumber_2;
      }

      if (this.control.control) {
        this.control.control.setValue(this.valorAnterior, { emit: false });
      }

      elemento.value = this.valorAnterior;
      elemento.selectionStart = elemento.selectionEnd = pos - 1;
    } 
    else {
      let maxlength = this.controlesBackEnd? this.controlesBackEnd.getAttributeValueByName('maxlength'):null;
      if (maxlength && valor.length > Number(maxlength)) 
      {
        elemento.selectionStart = elemento.selectionEnd = pos - 1;
        if (elemento.value.length < this.valorAnterior.length && pos === 0) {
          pos = this.codeResponseMagic.NoMagigNumber_2;
        }

        if (this.control.control) {
          this.control.control.setValue(this.valorAnterior, { emit: false });
        }
        elemento.value = this.valorAnterior;
        elemento.selectionStart = elemento.selectionEnd = pos - 1;

      } 
      else {
        this.valorAnterior = valor;
      }   
    }
  }
}
