import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { societiescomponent } from './societies/societies.component';
import { HomeMonetizerComponent } from './home-monetizer/home-monetizer.component';
import { generalmonetComponent } from './general-monet.component';
import { invoicesComponent } from './invoices/invoices.component';
import { OperationsComponent } from './operations/operations.component';
import { MonetizationComponent } from './monetization/monetization.component';
import { AccountingComponent } from './accounting/accounting.component';

const principalMonetizaor = '/monetizador';
const routes: Routes = [
  {
  path: '', component: generalmonetComponent, canActivate: [AuthGuard], 
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
          label: 'Catalogos',
          url: ''
        }
      ]
    } 
  },
  
  {
    path: 'invoices',
    component: invoicesComponent, 
    data:{
      title:'Catalogos',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Catalogos',
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
    path: 'societies',
    component: societiescomponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Catalogos',
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
    path: 'operations',
    component: OperationsComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Catalogos',
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
    path: 'accounting',
    component: AccountingComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Catalogos',
          url: principalMonetizaor
        },
        {
          label: 'Cuenta',
          url: ''
        }
      ]
    } 
  },
  {
    path: 'monetization',
    component: MonetizationComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Catalogos',
          url: principalMonetizaor
        },
        {
          label: 'Monetización',
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
