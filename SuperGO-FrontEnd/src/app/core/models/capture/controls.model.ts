import { JsonPipe } from '@angular/common';
import { FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import moment from 'moment';
import { Container } from './container.model';
import { Content } from './content.model';
import { Mask } from './mask.model';
import { Validation } from './validation.model';

export class Control {
  public idControl?:number;
  public ky?: string; //*
  public label?: string; //*
  public controlType?: string; //*
  public order?: number;
  public column?: number;
  public attributes?: any[];
  public validations?: Validation[]; //*
  public content?: Content;
  public disabled?: any;
  public isVerify?: number;
  public visibility?: any[];
  public class?: string;  
  public principalForm!: FormGroup |null; 
  constructor(
    obj: {
      idControl?:number;
      ky?: string;
      label?: string;
      controlType?: string;
      order?: number;
      column?: number;
      attributes?: any[];
      validations?: any[];
      disabled?: any;
      isVerify?: number;
    } = {}
  ) {
    this.idControl = obj.idControl;
    this.ky = obj.ky;
    this.label = obj.label;
    this.controlType = obj.controlType;
    this.order = obj.order;
    this.column = obj.column;
    this.attributes = obj.attributes;
    this.validations = obj.validations;
    this.disabled = obj.disabled;
    this.isVerify = obj.isVerify; 
  }

  onLoadControl() {
    this.configControlType();
    this.configContent();
    return this.configValidators(this.validations!);
  }

  configControlType(): void {
    switch (this.controlType) {
      case 'datepicker':
        let elem: any = this.findAttributeByName('value');
        if (elem != null) {
          elem['value'] = elem !== undefined || elem !== null
            ? moment(elem['value'], 'DD/MM/YYYY').toDate()
            : moment().toDate();
        }
        break;
      case 'textboxInfo':
        this.disabled = true;
        break;
      case 'textboxSearch':
        this.isVerify = -1;
        break;
      default:
        break;
    }
  }

  configValidators(validations: Validation[]): ValidatorFn[] {
    const validationsFn: ValidatorFn[] = [];
    validations.forEach((val: Validation) => {
      if (Number(val.type) === 1) {
        switch (val.validate) {
          case 'email':
            validationsFn.push(Validators.email);
            break;
          case 'required':
            validationsFn.push(this.getRequiredValidator());              
            break;
          case 'min':
            let min: any = this.getAttributeValueByName('min');
            validationsFn.push(Validators.min(min || 0));
            break;
          case 'max':
            let max: any = this.getAttributeValueByName('max');
            validationsFn.push(Validators.max(max || 0));
            break;
          case 'maxlength':
            let maxlength: any = this.getAttributeValueByName('maxlength');
            validationsFn.push(Validators.maxLength(maxlength || 0));
            break;
          case 'minlength':
            let minlength: any = this.getAttributeValueByName('minlength');
            validationsFn.push(Validators.minLength(minlength || 0));
            break;
          case 'pattern':
            const type = 2;
            const [pattern] = this.validations ? this.validations.filter((v) => {
              return Number(v.type) === type;
            }):[];
            if (pattern) {
              validationsFn.push(Validators.pattern(pattern.validate || ''));
            }
            break;
          default:
            break;
        }
      }
    });

    return validationsFn;
  }

  getRequiredValidator()
  {
    let validator:any;
    switch(this.controlType)
    {
      case 'slideButton':
        validator = Validators.requiredTrue;
      break;
      case 'autocomplete':
        validator = this.requireMatch;        
      break;
      default:
        validator = Validators.required;
        break;
    }

    return validator;
  }

  isUniqueValidate() {
    let unique = this.validations!.find((v) => { return v.type === 1 && v.validate === 'unique'; });
    if (unique) {
      return true;
    }
    else {
      return false;
    }
  }

  configContent() {
    if (this.content && this.content.contentList.length > 0) {
      switch (Number(this.content.type)) {
        case 1:
          this.content.endpoint = this.content.contentList[0].value;
          break;
        case 2:
          this.content.dependency = this.content.contentList[0].value;
          break;
        case 3:
          this.content.options = this.content.contentList;
          break;
        case 4:
          this.content.dependency = this.content.name;
          this.content.options = this.content.contentList;
          break;
        case 5:
          this.content.filter = this.content.contentList[0].value;
          break;
        default:
          break;
      }
    }
  }

  requireMatch(control: any): any {
    const selection: any = control.value;
    if (typeof selection === 'string') {
      if (selection.trim().length > 0) {
        return { incorrect: true };
      }
    }
    return null;
  }

  getDatePickerValue(_form: FormGroup) {
    let formatValor = '';
    if (moment(_form.controls[this.ky!].value).isValid()) {
      formatValor = moment(_form.controls[this.ky!].value.toString()).format(
        'DD-MM-YYYY'
      );
    }

    return formatValor;
  }

  getDatePickerRangeValue(_form: FormGroup) {
    let formatValor = '';
    let formRange = _form.get(this.ky!) as FormGroup;
    let jsonDates = JSON.parse(new JsonPipe().transform(formRange.value));
    Object.keys(jsonDates).forEach((elem: any) => {
      formatValor = `${formatValor}${jsonDates[elem] != null ? moment(jsonDates[elem]).format('DD-MM-YYYY') : 'null'},`;
    });
    return formatValor.substring(0, formatValor.length - 1);
  }

  getDecimalValue(_form: FormGroup) {
    let formatValor = '';
    let decimal = '';
    let validarDec: number = 0;

    formatValor = _form.controls[this.ky!].value.toString().replace(/[$,]/g, '');
    if (this.validations!.filter((v) => { return v.type === 1 && v.validate === 'format_0'; }).length > 0) {

      if (formatValor.indexOf('.') > 0) {
        decimal = formatValor.substring(formatValor.indexOf('.') + 1);
        formatValor = formatValor.substring(0, formatValor.indexOf('.'));
      }

      decimal = decimal.padEnd(2, '0');
      let maxlength = this.getAttributeValueByName('maxlength');
      formatValor = (formatValor + decimal).padStart(maxlength, '0');
    }

    validarDec = parseFloat(formatValor);
    if (!isNaN(validarDec) && validarDec <= 0) {
      throw new Error(
        'Favor de validar no se permiten decimales menores a cero'
      );
    }

    return formatValor;
  }

  getCheckBoxValue(_form: FormGroup) {
    let formatValor = '';
    const array = _form.get(this.ky!)?.get('CheckBoxes') as FormArray;
    if (array !== null) {
      if (array.controls !== null) {
        array.controls.forEach((k, i) => {
          if (k.value === true) {
            formatValor = `${formatValor}${this.content!.options[i].key},`;
          }
        });
      }
    }

    return formatValor;
  }

  getDropDownValue(_form: FormGroup) {
    let formatValor = '';    
    if(_form.controls[this.ky!].value)
    {     
      formatValor += _form.controls[this.ky!].value.toString();
      /*let filter = this.content!.options.filter((opcion) => {
        return opcion.ky === _form.controls[this.ky!].value.toString();
        });
        if (filter.length > 0) {
          formatValor += `${filter[0].value}`;
        }*/        
    }
    
    return formatValor;
  }

  
  setDropDownValue(control: Control, valor:any) {

      let filter = this.content!.contentList.filter((opcion) => {
        return opcion.ky == valor;
        }).map((opcion) => {
          return opcion.ky;
          });

         
    
    return filter[0];
    
  }

  deleteValuesForSettings(dataModal:any,indexF:Number,indexL:Number){
    dataModal = Object.values(dataModal).map((data:any) =>{
      return dataModal[data] = Object.values(data).slice(1|1);
    });

    return dataModal;
  }

  getValueForSettings(dataModal:any,indexF:Number,indexL:Number){
    dataModal = Object.values(dataModal).map((data:any) =>{
      return dataModal[data] = Object.values(data);
    });

    return dataModal;
  }

  setDataToControls( containers:Container[],dataModal:any) {
    containers.forEach((cont: Container) => {
      cont.controls.forEach((x: Control, i) => {
        const ctrl: Control = Object.assign(new Control(), x);
        var key = ctrl.ky?.toString() === undefined? '': ctrl.ky?.toString();
        var value = dataModal[key];
        if(key !== '')
          switch (ctrl.controlType) {
            case 'datepicker':
              ctrl.setAttributeValueByName('value',value);
              break;
            case 'decimal':
              ctrl.setAttributeValueByName('value',value);
              break;

            case 'label':
              ctrl.setAttributeValueByName('value',value);
              break;

            case 'checkbox':
              ctrl.setAttributeValueByName('value',value);
              break;

            case 'dropdown':
              ctrl.setAttributeValueByNameDropdown('value', ctrl.setDropDownValue(ctrl,value));
              break;

            case 'textboxInfo':
              ctrl.setAttributeValueByName('value',value);
              break;

            case 'autocomplete':
              ctrl.setAttributeValueByNameDropdown('value', value);
              break;

            default:
              ctrl.setAttributeValueByName('value',value);
              break;
          }
      });
    });  
  }


  getDataToControls( containers:Container[]) {
    var dataCatalog:{[k:string]:any}={};
    
    let _formAux:FormGroup;
    containers.forEach((cont: Container) => {
      _formAux = this.principalForm?.get(cont.idContainer) as FormGroup;
      cont.controls.forEach((x: Control, i) => {
        const ctrl: Control = Object.assign(new Control(), x);
        var ky = ctrl.ky !== undefined ? ctrl.ky : '';
        var value = ctrl.getAttributeValueByName('value');
        dataCatalog[ky.toString()] = value;
        var a = ctrl.getInfoValue(_formAux)
      });
    });

    
    return dataCatalog;
  }




  getInfoValue(_form: FormGroup) {
    let formatValor = '';
    if(_form.get(this.ky!))
    {
      if (isNaN(_form.controls[this.ky!].value.toString())) {
        formatValor = _form.controls[this.ky!].value.toString();
      } else if (
        this.validations!.filter((v) => {
          return v.type === 1 && v.validate === 'format_0';
        }).length > 0
      ) {
        let maxlength = this.getAttributeValueByName('maxlength');
        formatValor = _form.controls[this.ky!].value
          .toString()
          .padStart(maxlength, '0');
      } else {
        formatValor = _form.controls[this.ky!].value.toString();
      }
    }    

    return formatValor;
  }

  getAutocompleteValue(formulario: FormGroup): string {
    let formatValor = '';
    if (typeof formulario.controls[this.ky!].value === 'object') {
      formatValor = `${formulario.controls[this.ky!].value.ky} - ${formulario.controls[this.ky!].value.value}`;
    }
    return formatValor;
  }

  findAttributeByName(name: string) {
    let elem: any = null;
    if (this.attributes) {
      this.attributes.forEach((el: any) => {
        let [key] = Object.keys(el);
        if (key === name) {
          elem = el;
        }
      });
    }

    return elem;
  }

  setAttributeValueByName(name: string, value: any) {
    let elem: any = this.findAttributeByName(name);
    if (elem != null) {
      elem[name] = value;
    }
    else {
      if (this.attributes) {
        this.attributes.push(JSON.parse(`{"${name}":"${value}"}`));
      }
    }
  }

  setAttributeValueByNameDropdown(name: string, value: any) {
    let elem: any = this.findAttributeByName(name);
    if (elem != null) {
      elem[name] = value;
    }
    else {
      if (this.attributes) {
        var data:any;
        for(data of this.attributes){
          if (Object.keys(data).length === 0){
            data.value = value;
            break;
          }
        }
      }
    }
  }

  getAttributeValueByName(name: string): any {
    let elem: any = this.findAttributeByName(name);
    return elem === null ? null : elem[name];
  }

  getMask(): Mask {
    let mask: Mask = {} as Mask;
    let pattern = this.validations!.find((v) => { return v.type == 2; });
    if (pattern) {
      mask = {
        regex: pattern.validate,
        controles: this,
      } as Mask;
    }
    return mask;
  }

  getLengthValue(_form: FormGroup)
  {
    if(_form.get(this.ky!))
    {
      let valueTxt = _form.controls[this.ky!].value;
      if(valueTxt &&  typeof valueTxt ==='string')
      {
        return valueTxt.length;
      }
    }   

    return 0;
  }
}
