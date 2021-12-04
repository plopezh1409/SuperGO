import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-list-control',
  templateUrl: './list-control.component.html',
  styleUrls: ['./list-control.component.sass']
})
export class ListControlComponent implements OnInit{  
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  public defaultSelected = 0;
  public selection: number=0;
  type:any;
  value:any; 
  

  ngOnInit(): void {
    this.type = this.control.getAttributeValueByName('type');
    this.value = this.control.getAttributeValueByName('value');
  }
}
