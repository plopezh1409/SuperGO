import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-slide-button-control',
  templateUrl: './slide-button-control.component.html',
  styleUrls: ['./slide-button-control.component.sass']
})
export class SlideButtonControlComponent implements OnInit {
  @Input() control!: Control;
  @Input() form!: FormGroup;
  value:boolean=false;    

  ngOnInit(): void {
    this.value = this.control.getAttributeValueByName('value')==='true'? true : false;
  }

}
