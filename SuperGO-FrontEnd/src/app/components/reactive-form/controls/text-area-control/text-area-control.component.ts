import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-text-area-control',
  templateUrl: './text-area-control.component.html',
  styleUrls: ['./text-area-control.component.sass']
})
export class TextAreaControlComponent implements OnInit {
  @Input() control!: Control;
  @Input() form!: FormGroup;
  mask: any;

  ngOnInit(): void {
    this.mask = this.control.getMask();
  }

}
