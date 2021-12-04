import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//COMPONENTES
import { AutocompleteControlComponent } from './controls/autocomplete-control/autocomplete-control.component';
import { BusquedaPorCampoControlComponent } from './controls/busqueda-por-campo-control/busqueda-por-campo-control.component';
import { BusquedaPorCampoMultipleControlComponent } from './controls/busqueda-por-campo-multiple-control/busqueda-por-campo-multiple-control.component';
import { DatepickerControlComponent } from './controls/datepicker-control/datepicker-control.component';
import { DropdownControlComponent } from './controls/dropdown-control/dropdown-control.component';
import { InfoControlComponent } from './controls/info-control/info-control.component';
import { LabelControlComponent } from './controls/label-control/label-control.component';
import { ListControlComponent } from './controls/list-control/list-control.component';
import { TextBoxControlComponent } from './controls/text-box-control/text-box-control.component';
import { RadioButtonsControlComponent } from './controls/radio-buttons-control/radio-buttons-control.component';
import { TextAreaControlComponent } from './controls/text-area-control/text-area-control.component';

//MATERIAL
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

//MODULOS
import { SharedModule } from '@app/shared/shared.module';
import { NgxInputLoaderModule } from 'ngx-input-loader';

import { ContainerComponent } from './container/container.component';
import { DatepickerRangeControlComponent } from './controls/datepicker-range-control/datepicker-range-control.component';
import { SlideButtonControlComponent } from './controls/slide-button-control/slide-button-control.component';


@NgModule({
  declarations: [
    AutocompleteControlComponent,
    BusquedaPorCampoControlComponent,
    BusquedaPorCampoMultipleControlComponent,
    DatepickerControlComponent,
    DropdownControlComponent,        
    InfoControlComponent,
    LabelControlComponent,
    ListControlComponent,    
    TextBoxControlComponent,
    RadioButtonsControlComponent,
    ContainerComponent,
    TextAreaControlComponent,
    DatepickerRangeControlComponent,
    SlideButtonControlComponent,      
  ],
  imports: [
    CommonModule,          
    NgxInputLoaderModule,  
    MatAutocompleteModule,    
    MatDatepickerModule,    
    MatGridListModule,       
    MatListModule,
    MatSelectModule, 
    MatSlideToggleModule, 
    MatRadioModule,    
    SharedModule,
  ],
  exports:[    
    ContainerComponent
  ]
})
export class ReactiveFormModule { }
