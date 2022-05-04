import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.sass'],
})
export class ContainerComponent {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  @Input() container: Container;
  @Input() formGroup: FormGroup;
  @Input() alignContent:string;
  @Output() onChangeDropDown: EventEmitter<any>;

  @Input() titulo: string | undefined;
  public totalColumnas: number;
  public setErrorFormulario: any = null;
  public objetosDependenciaBusquedaVsInfo: any[] = [];
  public cambioSeleccionEnDropdown = false;

  constructor() {
    this.alignContent='vertical';
    this.totalColumnas = Number(this.codeResponseMagic.RESPONSE_CODE_12);
    this.container = {} as Container;
    this.formGroup = new FormGroup({});
    this.onChangeDropDown = new EventEmitter();    
  }  

  onCambioEnSeleccionDropdown(ctrl: Control) {
    this.onChangeDropDown.emit({control:ctrl,idContainer:this.container.idContainer});     
    let txtControl:AbstractControl|null;

    const textBoxLinks = this.container.controls.filter((val: any) => val.controlType === 'textboxLink' && val.content.dependency === ctrl.ky);
    if (textBoxLinks !== undefined && textBoxLinks.length > 0) {
      textBoxLinks.forEach((elem) => {  
        txtControl = this.formGroup.get(elem.ky!);
        if(txtControl!=null)
        {
          txtControl.setValue('');    
          txtControl.markAsTouched();  
        }        
      });

      this.cambioSeleccionEnDropdown = true;
      setTimeout(() => {
        this.cambioSeleccionEnDropdown = false;
      }, Number(this.codeResponseMagic.RESPONSE_CODE_100));
    }
  }

  onCambioEnSeleccionAutocomplete(ctrl: Control){
    this.onChangeDropDown.emit({control:ctrl,idContainer:this.container.idContainer});     
    let txtControl:AbstractControl|null;

    const textBoxLinks = this.container.controls.filter((val: any) => val.controlType === 'autocomplete' && val.content.dependency === ctrl.ky);
    if (textBoxLinks !== undefined && textBoxLinks.length > 0) {
      textBoxLinks.forEach((elem) => {  
        txtControl = this.formGroup.get(elem.ky!);
        if(txtControl!=null)
        {
          txtControl.setValue('');    
          txtControl.markAsTouched();  
        }        
      });

      this.cambioSeleccionEnDropdown = true;
      setTimeout(() => {
        this.cambioSeleccionEnDropdown = false;
      }, Number(this.codeResponseMagic.RESPONSE_CODE_100));
    }
  }

  onNombreEtiquetaImprimirRespuesta(val: any) {    
    this.objetosDependenciaBusquedaVsInfo.push(val);
  }
}
