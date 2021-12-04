import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-info-control',
  templateUrl: './info-control.component.html',
  styleUrls: ['./info-control.component.sass']
})
export class InfoControlComponent implements OnInit {
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  @Output() nombreEtiquetaImprimirRespuesa = new EventEmitter();  

  ngOnInit(): void {
    if(this.control.content && this.control.content.dependency) {
        this.nombreEtiquetaImprimirRespuesa.emit({dependency:this.control.content!.dependency, ky:this.control.ky!});
            
    }
  }

}
