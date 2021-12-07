import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingsComponent } from './accountings/accountings.component';
import { TableAccountingComponent } from './table-accounting/table-accounting.component';
import { GeneralAccountingComponent } from './general-accounting/general-accounting.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { UpdateModalAccountingComponent } from './update-modal-accounting/update-modal-accounting.component';


@NgModule({
  declarations: [
    AccountingsComponent,
    TableAccountingComponent,
    GeneralAccountingComponent,
    UpdateModalAccountingComponent
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class AccountingModule { }
