import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.sass']
})
export class ProgressComponent {
  @Input() value: number;
  @Input() diameter: number;
  @Input() mode: any;
  @Input() strokeWidth: number;
  @Input() overlay: boolean;
  @Input() color: string;

  constructor() {
    this.value = 100;
    this.diameter = 70;
    this.mode = 'indeterminate';
    this.strokeWidth = 10;
    this.overlay = false;
    this.color = 'primary';
  }
}
