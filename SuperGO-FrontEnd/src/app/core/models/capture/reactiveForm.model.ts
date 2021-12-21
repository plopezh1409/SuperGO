import { FormControl, FormGroup} from '@angular/forms';
import { Container } from './container.model';
import { Control } from './controls.model';

export class ReactiveForm{   
      public uniqueControl: {}[];  
      public principalForm!: FormGroup |null;        

      constructor(){
        this.uniqueControl=[];        
      }

      buildFormControl(container: Container): FormGroup {
        const formGroup: FormGroup = new FormGroup({});
        for(let i=0; i<container.controls.length; i++)
        {    
        
          container.controls[i] = Object.assign(new Control(), container.controls[i]);  
          if(container.controls[i])
          {
            if(container.controls[i].controlType === 'datepickerRange' )
            {      
              formGroup.addControl((container.controls[i].ky||''), new FormGroup({}));
            }
            else
            {
              this.getGenericFormGroup(container.controls[i], container.idContainer, formGroup);
            }
          }          
        }    
    
        return formGroup;
      }

      getGenericFormGroup(control:Control, idContainer:string, formGroup: FormGroup )
      {        
        let value:string|null = null;
        const validations = control.onLoadControl();
        this.setUniqueValidate(control, idContainer);
        value = control.getAttributeValueByName('value');
        value = (!value)?'':value;  
        if(control.ky!== undefined)
        {
          formGroup.addControl((control.ky || ''), validations ? new FormControl({ value: value || '', disabled: control.disabled }, validations) :
                          new FormControl({ value: value || '', disabled: control.disabled }));
        }        
      }

      setUniqueValidate(control:Control, idContainer:string)
      {
        if(control.isUniqueValidate())
        {
          this.uniqueControl.push({control, idContainer});
        }
      }
    
      getFormGroup(nombre: string) {
        return (this.principalForm?.get(nombre) as FormGroup);
      }
    
      onFormChange(){ 
        if(this.uniqueControl.length > 0)
        {
          const ctrls = Object.assign([], this.uniqueControl);
          while(ctrls.length>0)
          {
            this.validUniqueInfo(ctrls);            
          }
        }
      }

      validUniqueInfo(ctrls:any)
      {
        const ctrl = ctrls.shift();
        const index = ctrls.findIndex((x:any)=> x.ky === ctrl.ky);
        if(index >= 0)
            { 
              if(Number(ctrl.idContainer)!==Number(ctrls[index].idContainer))
              {
                const _formCtrl = this.principalForm?.get(ctrl.idContainer) as FormGroup;
                const _formIndex = this.principalForm?.get(ctrls[index].idContainer) as FormGroup;                 

                if(
                (_formCtrl.get(ctrl.control.ky)?.status === 'VALID' && _formIndex.get(ctrl.control.ky)?.status === 'VALID') &&
                (_formCtrl.controls[(ctrl.control.ky||'')].value.trim() === _formIndex.controls[(ctrl.control.ky||'')].value.trim()))
                {
                  _formIndex.controls[(ctrl.control.ky||'')].setValue('');
                  throw new Error(`Los valores en los campos '${ctrl.control.ky}' no pueden ser iguales`);
                }
                ctrls.splice(index,1);
              }              
            }
      }      

      getInfoByJsonFormat(containers:Container[])
      {        
        let jsonPetition = `{`;
        let _formAux:FormGroup;
        let ctrl:Control;
        containers.forEach((cont: Container) => {
          _formAux = this.principalForm?.get(cont.idContainer) as FormGroup;
          jsonPetition = `${jsonPetition} "${cont.name}":{`;
          cont.controls.forEach((x: Control) => {
            ctrl = Object.assign(new Control, x);            
            switch (ctrl.controlType) {
              case 'autocomplete':
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getAutocompleteValue(_formAux)}",`;
                break;
              case 'checkbox':
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getCheckBoxValue(_formAux)}",`;
                break;
              case 'datepicker':
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getDatePickerValue(_formAux)}",`;
                break;
              case 'datepickerRange':
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getDatePickerRangeValue(_formAux)}",`;
                break;
              case 'decimal':
                  jsonPetition = `${jsonPetition} "${ctrl.ky}": "${ctrl.getDecimalValue(_formAux)}",`;
                break;
              case 'dropdown':
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getDropDownValue(_formAux)}",`;
                break;              
              case 'label':
                break;
              case 'textboxInfo':
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getInfoValue(_formAux)}",`;
                break;             
              default:
                jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getInfoValue(_formAux)}",`;
                break;
            }
          });

          jsonPetition = jsonPetition.substring(0, jsonPetition.length - 1);
          jsonPetition = `${jsonPetition} },`;

        });

        jsonPetition = jsonPetition.substring(0, jsonPetition.length - 1);
        jsonPetition = `${jsonPetition} }`;        
        return jsonPetition;
      }


      isValid(containers:Container[]):boolean
      {
        let _formAux:FormGroup;
        let isValid=true;
        containers.forEach((cont: Container) => {

          _formAux = this.principalForm?.get(cont.idContainer) as FormGroup;
          Object.keys(_formAux.controls).forEach(key => {            
            _formAux.controls[key].markAsTouched();
          });
         
          if(!_formAux.valid)
          {
            isValid=false;
          }
        });

        return isValid;
      }

      setContainers(containers:Container[]) {
        if (containers != null && containers.length > 0) {
          const form: any = {};
          containers.forEach(elem => {
            const formGroup = this.buildFormControl(elem);        
            form[elem.idContainer] = formGroup;
          });      
          this.principalForm = new FormGroup(form);      
        }
      }  


      cleanValuesForm(containers:Container[])
      {
        let _formAux:FormGroup;
        containers.forEach((cont: Container) => {
          _formAux = this.principalForm?.get(cont.idContainer) as FormGroup;
          _formAux.reset();      
          let ctrls = cont.controls.filter(c=> c.getAttributeValueByName('value'));
          console.log(ctrls);
        });
      }
}