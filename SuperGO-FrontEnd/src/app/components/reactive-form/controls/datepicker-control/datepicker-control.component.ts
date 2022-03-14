import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Control } from '@app/core/models/capture/controls.model';
import { ServiceNoMagigNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import moment from 'moment';
export const FORMATOS_FECHA = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-datepicker-control',
  templateUrl: './datepicker-control.component.html',
  styleUrls: ['./datepicker-control.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMATOS_FECHA },    
  ]
})
export class DatepickerControlComponent  implements OnInit{ 
  
  private readonly codeResponseMagic: ServiceNoMagigNumber = new ServiceNoMagigNumber(); 
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  @Input() index!: any;

   
  mask:any;
  value:any;


  min:Date|null;
  max:Date|null;
  dateFilter:any; 

  constructor() {    
    this.min=null;
    this.max=null;    
    this.dateFilter=null;
   }

  ngOnInit(): void {    
    this.mask = this.control.getMask(); 
    this.value = this.control.getAttributeValueByName('value');
    this.min = this.control.getAttributeValueByName('min')==null?null: this.getDate(this.control.getAttributeValueByName('min'));
    this.max = this.control.getAttributeValueByName('max')==null?null: this.getDate(this.control.getAttributeValueByName('max'));
    if(this.control.content?.filter && this.control.content?.filter=='outweekends')
    {      
      this.dateFilter = (d: any | null): boolean => {
        const day= (moment(d).toDate()||new Date()).getDay();        
        return day !== 0 && day !== this.codeResponseMagic.NoMagigNumber_6;
      };
    }
  }

  getDate(date:string):Date{    
    return moment(date, 'DD/MM/YYYY').toDate();
  }
}
