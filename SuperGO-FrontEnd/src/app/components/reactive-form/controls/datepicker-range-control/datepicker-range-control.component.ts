import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
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
  selector: 'app-datepicker-range-control',
  templateUrl: './datepicker-range-control.component.html',
  styleUrls: ['./datepicker-range-control.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMATOS_FECHA },    
  ]
})
export class DatepickerRangeControlComponent implements OnInit {
  
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  @Input() control!: Control;
  @Input() form!: FormGroup;
  @Input() index!: any;
  formRange:FormGroup;  
  start:string;
  end:string;
  attributes:any[];
  min:Date|null;
  max:Date|null;
  dateFilter:any; 
  
  constructor() {
    this.formRange = new FormGroup({});
    this.start = '';
    this.end = '';
    this.min=null;
    this.max=null;
    this.attributes=[];
    this.dateFilter=null;
   }

  ngOnInit(): void {
    this.formRange = this.form.get(this.control.ky!) as FormGroup;
    this.start=`${this.control.ky}_start`;
    this.end=`${this.control.ky}_end`;
    if(this.control.attributes && this.control.attributes.length > 0)
    {
      this.control.attributes.forEach(attr=>{        
        const [ky] = Object.keys(attr);        
        if(ky)
        { 
          switch(ky)
          {
            case 'min':              
              this.min = this.getDate(attr[ky]); 
              break;
            case 'max':              
              this.max = this.getDate(attr[ky]);             
              break;                       
            default:              
              this.attributes.push(attr);
              break;
          }
        }
      });
    }
    const validations = this.control.onLoadControl();
    if(this.control.content?.filter && this.control.content?.filter==='outweekends')
    {      
      this.dateFilter = (d: any | null): boolean => {
        const day= (moment(d).toDate()||new Date()).getDay();        
        return day !== 0 && day !== this.codeResponseMagic.RESPONSE_CODE_6;
      };
    }

    this.formRange.addControl(this.start ,new FormControl(validations));
    this.formRange.addControl(this.end,new FormControl(validations));  
  }

  getDate(date:string):Date{
    return moment(date, 'DD/MM/YYYY').toDate();
  }   
}
