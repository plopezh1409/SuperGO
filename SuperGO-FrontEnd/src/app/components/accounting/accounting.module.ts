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


@NgModule({
  declarations: [
    AccountingsComponent,
    TableAccountingComponent,
    GeneralAccountingComponent
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
