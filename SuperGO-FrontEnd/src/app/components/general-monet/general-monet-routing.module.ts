import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { SocietiesComponent } from './societies/societies.component';
import { HomeMonetizerComponent } from './home-monetizer/home-monetizer.component';
import { GeneralmonetComponent } from './general-monet.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { OperationsComponent } from './operations/operations.component';
import { MonetizationComponent } from './monetization/monetization.component';
import { AccountingComponent } from './accounting/accounting.component';

const principalMonetizaor = '/monetizador';
const routes: Routes = [
  {
  path: '', component: GeneralmonetComponent, canActivate: [AuthGuard], 
  children:[{
    path: '', component: HomeMonetizerComponent, 
    data:{
      title: 'solicitudGeneral',
      breadcrumb: [
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Monetizador',
          url: ''
        }
      ]
    } 
  },
  
  {
    path: 'especifica/:idSolicitud/invoices',
    component: InvoicesComponent, 
    data:{
      title:'Catalogos',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Monetizador',
          url: principalMonetizaor
        },
        {
          label: 'Facturas',
          url: ''
        }
      ]
    }   
  },
  {
    path: 'especifica/:idSolicitud/societies',
    component: SocietiesComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Monetizador',
          url: principalMonetizaor
        },
        {
          label: 'Sociedades',
          url: ''
        }
      ]
    } 
  },
  {
    path: 'especifica/:idSolicitud/operations',
    component: OperationsComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Monetizador',
          url: principalMonetizaor
        },
        {
          label: 'Tipos de Operacion',
          url: ''
        }
      ]
    } 
  },
  {
    path: 'especifica/:idSolicitud/accounting',
    component: AccountingComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Monetizador',
          url: principalMonetizaor
        },
        {
          label: 'Contabilidad',
          url: ''
        }
      ]
    } 
  },
  {
    path: 'especifica/:idSolicitud/monetization',
    component: MonetizationComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Monetizador',
          url: principalMonetizaor
        },
        {
          label: 'Reglas de Monetización',
          url: ''
        }
      ]
    } 
  },
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetitionRoutingModule { }
