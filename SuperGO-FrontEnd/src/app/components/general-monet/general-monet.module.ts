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
import { OperationsComponent } from './operations/operations.component';
import { AccountingComponent } from './accounting/accounting.component';
import { MonetizationComponent } from './monetization/monetization.component';
import { UpdateModalInvoicesComponent } from './invoices/update-modal-invoices/update-modal-invoices.component';
import { UpdateModalAccountingComponent } from './accounting/update-modal-accounting/update-modal-accounting.component';
import { AccountingTablesComponent } from './accounting/accounting-tables/accounting-tables.component';
import { MonetizationTableComponent } from './monetization/monetization-table/monetization-table.component';
import { UpdateModalMonetizationComponent } from './monetization/update-modal-monetization/update-modal-monetization.component';
import { OperationsTableComponent } from './operations/operations-table/operations-table.component';
import { UpdateModalOperationsComponent } from './operations/update-modal-operations/update-modal-operations.component';
import { SocietiesTableComponent } from './societies/societies-table/societies-table.component';
import { UpdateModalSocietiesComponent } from './societies/update-modal-societies/update-modal-societies.component';
import { HomeMonetizerComponent } from './home-monetizer/home-monetizer.component';


@NgModule({
  declarations: [
    generalmonetComponent,
    societiescomponent,
    invoicesComponent,    
    invoicesTableComponent,
    OperationsComponent,
    AccountingComponent,
    MonetizationComponent,
    UpdateModalInvoicesComponent,
    UpdateModalAccountingComponent,
    AccountingTablesComponent,
    MonetizationTableComponent,
    UpdateModalMonetizationComponent,
    OperationsTableComponent,
    UpdateModalOperationsComponent,
    SocietiesTableComponent,
    UpdateModalSocietiesComponent,
    HomeMonetizerComponent
  ],
  imports: [
    CommonModule,
    PetitionRoutingModule,    
    ReactiveFormModule,
    MatButtonModule,                
    MatTabsModule,    
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    SharedModule,   
    MatProgressSpinnerModule
  ]
})

export class GeneralMonetModule { 

}
