import { Component, Input } from '@angular/core';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-label-control',
  templateUrl: './label-control.component.html',
  styleUrls: ['./label-control.component.sass']
})
export class LabelControlComponent {
  @Input() control! : Control;
}