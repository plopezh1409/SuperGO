import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Content } from '@app/core/models/capture/content.model';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-text-box-control',
  templateUrl: './text-box-control.component.html',
  styleUrls: ['./text-box-control.component.sass'],
})
export class TextBoxControlComponent implements OnInit {
  @Input() control!: Control;
  @Input() form!: FormGroup;
  @Input() controlesDesdeBackend!: any;
  @Input() set cambioEnSeleccionDropdown(val: any) {    
    if (val && this.control.controlType === 'textboxLink') {
      this.cambiarValidadoresPorDropdown();
    }
  }  
  @Input() set setErrores(val: any) {
    if (val) {
      this.setError = true;
    } else {
      this.setError = false;
    }
  }
  mask: any;
  nuevoValorMinLength = 1;
  setError: boolean = false; 
  controlClass:string='';

  onBlur() {
    if (this.control.controlType === 'textboxLink') {
      const { content } = this.control;      
      const absControl= this.form.get(content?.dependency!);
      if(absControl!== null)
      {
        absControl.markAsTouched();
        if (absControl.status === 'INVALID') {
          absControl.setValue('');
        }
      }
      
      this.form.controls[this.control.ky!].markAsTouched();
    }
  }

  onChangeInput() {
    setTimeout(() => {
      if (this.setError) {
        this.form.controls[this.control.ky!].setValue('');
        this.setError = false;
      }
    }, 100);
  }  

  ngOnInit(): void {
    this.mask = this.control.getMask();
    this.controlClass = (this.form.get(this.control.label!)?.errors?.required!==undefined && this.form.get(this.control.label!)?.errors?.required === true)? 
    'form-react-form-field-Color':'form-react-form-field';
  }

  onInput() {
    if (this.control.controlType === 'textboxLink') {
      this.validDependenceByDropDown();
    }
  }

  getLengthValue()
  {     
    let valueTxt = this.form.get(this.control.ky!)?.value;
    if(valueTxt)
    {
      return valueTxt.length;
    }

    return 0;
  }

  /***********MANEJO DE CAMBIO DE VALIDACIONES DEPENDIENTES DE UN COMBOBOX**************/
  validDependenceByDropDown() {
    const { content } = this.control;
    if (this.form.get(content?.dependency!)?.status === 'VALID') {
      let valueDropDown = this.form.get(content?.dependency!)?.value;
      let newDropDownValidation = content!.options.find((x) => Number(x.ky) == Number(valueDropDown));
      if (newDropDownValidation) {
        this.changeNewValidation(newDropDownValidation);        
      }
    } 
    else 
    {
      const absControl=this.form.get(content?.dependency!);
      if(absControl!==null)
      {
        absControl.markAsTouched();
      }
      
      this.form.controls[this.control.ky!].markAsTouched();
      this.form.controls[this.control.ky!].setValue('');
    }
  }

  changeNewValidation(newDropDownValidation:any){
    JSON.parse(newDropDownValidation.value.replace(/'/g, '"')).forEach((elem: any) => {
        let validation = Object.keys(elem);
        validation.forEach((v) => {
          if ((elem[v].indexOf('|') > -1) && (v == 'minlength')){             
            let minlength = elem[v].split('|').find((x: any) =>this.form.get(this.control.ky!)?.value.length <= x);
            if (minlength) {
              if (this.form.get(this.control.ky!)?.value.length < minlength) {
                this.control.setAttributeValueByName(v, minlength);
                this.form.controls[this.control.ky!].setErrors({ minlength: minlength });
              }
            }            
          }
        });
      }
    );
  }

  cambiarValidadoresPorDropdown() {
    const { content } = this.control;  
    if(content)
    {
      const dropdownForm = this.form.get(content.dependency!);
      if(dropdownForm!=null && dropdownForm.status === 'VALID')
      { 
        let valueDropDown = dropdownForm.value;
        let newDropDownValidation = content.options.find((x) => Number(x.ky) == Number(valueDropDown));
        this.setAttributeValue(content, valueDropDown);               
      }     
    }   
  }

  setAttributeValue(content:Content, valueDropDown:any){
    let newDropDownValidation = content.options.find((x) => Number(x.ky) == Number(valueDropDown));
    if (newDropDownValidation) 
    {
      try{
        JSON.parse(newDropDownValidation.value.replace(/'/g, '"')).forEach((elem: any) => {
          let validation = Object.keys(elem);
          validation.forEach((v) => {
            if (elem[v].indexOf('|') === -1) {
              this.control.setAttributeValueByName(v, elem[v]);
            } else {
              this.control.setAttributeValueByName(v, elem[v].split('|')[0]);
            }
          });
        });
      }
      catch(e)
      {
        throw new Error("Error al reestablecer los nuevos valores para los atributos del campo " + this.control.label);            
      }

      this.form.controls[this.control.ky!].setValidators(this.control.configValidators(this.control.validations!));
    } 

  }
  /***********FIN MANEJO DE CAMBIO DE VALIDACIONES DEPENDIENTES DE UN COMBOBOX**************/
}