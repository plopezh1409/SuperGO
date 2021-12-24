import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BillsComponent } from './bills/bills.component';
import { GeneralBillsComponent } from './general-bills/general-bills.component';
import { TableBillsComponent } from './table-bills/table-bills.component';
import { UpdateModalBillComponent } from './update-modal-bill/update-modal-bill.component';



@NgModule({
  declarations: [
    BillsComponent,
    GeneralBillsComponent,
    TableBillsComponent,
    UpdateModalBillComponent
  ],
  imports: [
    CommonModule,
    BillRoutingModule,
    SharedModule,
    ReactiveFormModule,
    MatPaginatorModule,
    MatTableModule


  ]
})



export class BillModule { }
