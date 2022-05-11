import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BinnacleComponent } from './binnacle.component';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { DetailBinnacleComponent } from './detail-binnacle/detail-binnacle.component';
import { GeneralBinnacleComponent } from './general-binnacle/general-binnacle.component';

const routes: Routes = [
  {
    path: '',
    component: BinnacleComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GeneralBinnacleComponent, canActivate: [AuthGuard],
        data: {
          title: 'Bitacora',
          breadcrumb:[
            {
              label: 'Inicio',
              url: 'inicio'
            },
            {
              label: 'Bitacora',
              url: ''
            },
          ],
        },
      },
      {
        path: 'especifica/:status/:folio/:idmodule/:solicitude',
        component: DetailBinnacleComponent, canActivate:[AuthGuard],
        data:{
          title:'',
          breadcrumb: [
            {
              label: 'Inicio',
              url: 'inicio'
            },
            {
              label: 'Bitacora',
              url:'/bitacora/21'
            },
            {
              label: 'Detalle',
              url: ''
            },
          ],
        },
      }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class BinnacleRoutingModule { }
