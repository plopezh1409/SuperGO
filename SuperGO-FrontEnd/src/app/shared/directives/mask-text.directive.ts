import { Directive, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Directive({
    selector: '[maskText]'
  })
  export class MaskTextDirective {

    private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber(); 
    private valorAnterior: string;
    private regExpr: any;
    @Optional() private control: NgControl;
    @Input()
    set maskText(value: any) {
      this.regExpr = new RegExp(value);
    }
  
    constructor(control: NgControl) {
      this.valorAnterior = '';
      this.control = control;
    }
  
    @HostListener('input', ['$event'])
    change($event: any): void {
      let elemento: any;
      let valor: any;
      let pos: any;
      let mismoValor: any;
      let noEsIgual: boolean;
      elemento = $event.target;
      valor = elemento.value;
      pos = elemento.selectionStart;
      mismoValor = valor;
      noEsIgual = (valor && !(this.regExpr.test(mismoValor)));
      if (noEsIgual) {
        elemento.selectionStart = elemento.selectionEnd = pos - 1;
        if (elemento.value.length < this.valorAnterior.length && pos === 0) {  pos = this.codeResponseMagic.RESPONSE_CODE_2; }
        if (this.control !== null) {
          if (this.control.control !== null) {  this.control.control.setValue(this.valorAnterior, { emit: false });}
        }
        elemento.value = this.valorAnterior;
        elemento.selectionStart = elemento.selectionEnd = pos - 1;
      }    else { this.valorAnterior = valor; }
    }
  }