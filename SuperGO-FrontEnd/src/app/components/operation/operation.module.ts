import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { GeneralOperationsComponent } from './general-operations/general-operations.component';
import { TableOperationsComponent } from './table-operations/table-operations.component';
import { OperationsComponent } from './operations/operations.component';
import { BillRoutingModule } from '../bill/bill-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    GeneralOperationsComponent,
    TableOperationsComponent,
    OperationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormModule,
    MatPaginatorModule,
    MatTableModule,
    OperationRoutingModule
  ]
})
export class OperationModule { }
