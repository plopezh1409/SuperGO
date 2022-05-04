import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-dropdown-control',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.sass']
})
export class DropdownControlComponent implements OnInit{
  @Input() control!: Control;
  @Input() formulario!: FormGroup;  
  @Output() cambioEnSeleccionDropdown : EventEmitter<boolean>;
  value:any;  

  constructor() {
    this.cambioEnSeleccionDropdown = new EventEmitter();
   }

  ngOnInit(): void {
    this.value = this.control.getAttributeValueByName('value');    
  }

  onChange() {    
    this.cambioEnSeleccionDropdown.emit(true);
  }
}
