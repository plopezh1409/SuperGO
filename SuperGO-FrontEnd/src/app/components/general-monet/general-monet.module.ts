import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//MATERIAL 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  

//MODULES
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';
import { PetitionRoutingModule } from './general-monet-routing.module';

//SERVICES


//COMPONENTS
import { generalmonetComponent } from './general-monet.component';
import { societiescomponent } from './societies/societies.component';
import { invoicesComponent } from './invoices/invoices.component';
import { invoicesTableComponent } from './invoices/invoices-table/invoices-table.component';


@NgModule({
  declarations: [
    generalmonetComponent,
    societiescomponent,
    invoicesComponent,    
    invoicesTableComponent
  ],
  imports: [
    CommonModule,
    PetitionRoutingModule,    
    ReactiveFormModule,
    MatButtonModule,                
    MatTabsModule,    
    MatTableModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule,   
    MatProgressSpinnerModule
  ],
})
export class generalmonetModule { 

}
