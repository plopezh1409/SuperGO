import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-radio-buttons-control',
  templateUrl: './radio-buttons-control.component.html',
  styleUrls: ['./radio-buttons-control.component.sass']
})
export class RadioButtonsControlComponent implements OnInit{  
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  type:any;

  ngOnInit(): void {
    this.type = this.control.getAttributeValueByName('type');    
  }
}
