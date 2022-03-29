import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-control',
  templateUrl: './autocomplete-control.component.html',
  styleUrls: ['./autocomplete-control.component.sass']
})
export class AutocompleteControlComponent implements OnInit {
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  filtrarOpciones:Observable<any[]>;
  mask:any;

  constructor(){
    this.filtrarOpciones = new Observable<any[]>();     
  }

  ngOnInit(): void {
    this.mask = this.control.getMask();
    this.filtrarOpciones = this.formulario.get(this.control.ky!)!.valueChanges
    .pipe(startWith(''), map((opcion:any) =>opcion? this.filtrar(opcion):this.control.content!.options.slice()));
  }

  filtrar(item:any):any[]{
    const valorfiltrado = (typeof item === 'object')? item.value.toLowerCase():item.toLowerCase();
    return this.control.content!.options.filter((opcion:any) => opcion.value.toLowerCase().includes(valorfiltrado));
  }

  displayWith(obj: any): string {    
    return (obj ? obj.value : '');
  }
}
