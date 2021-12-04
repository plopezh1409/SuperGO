import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { GeneralComponent } from './general/general.component';
import { TablaCatalogoComponent } from './tabla-catalogo/tabla-catalogo.component';
import { SharedModule } from '@app/shared/shared.module';
import { CatalogsComponent } from './catalogs.component';
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';

@NgModule({
  declarations: [
    GeneralComponent,
    TablaCatalogoComponent,
    CatalogsComponent
  ],
  imports: [
    CatalogsRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormModule
  ]
})
export class CatalogsModule { }
