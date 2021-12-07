import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonetizationRoutingModule } from './monetization-routing.module';
import { GeneralMonetizationComponent } from './general-monetization/general-monetization.component';
import { TableMonetizationComponent } from './table-monetization/table-monetization.component';
import { MonetizationsComponent } from './monetizations/monetizations.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    GeneralMonetizationComponent,
    TableMonetizationComponent,
    MonetizationsComponent
  ],
  imports: [
    CommonModule,
    MonetizationRoutingModule,
    SharedModule,
    ReactiveFormModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class MonetizationModule { }
