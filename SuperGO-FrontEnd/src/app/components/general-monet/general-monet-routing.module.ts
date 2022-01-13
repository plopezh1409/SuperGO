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
          label: 'Solicitud',
          url: ''
        }
      ]
    } 
  },
  {
    path: '/monetizador',
    component: HomeMonetizerComponent,
    data: {
      title: 'solicitudGeneral',
      breadcrumb: [
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Solicitud',
          url: ''
        }
      ]
    }    
  },
  {
    path: '/monetizador/invoices',
    component: invoicesComponent, 
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Solicitud',
          url: principalMonetizaor
        },
        {
          label: 'invoices',
          url: ''
        }
      ]
    }   
  },
  {
    path: '/monetizador/societies',
    component: societiescomponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Solicitud',
          url: principalMonetizaor
        },
        {
          label: 'societies',
          url: ''
        }
      ]
    } 
  },
  {
    path: '/monetizador/operations',
    component: OperationsComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Solicitud',
          url: principalMonetizaor
        },
        {
          label: 'operations',
          url: ''
        }
      ]
    } 
  },
  {
    path: '/monetizador/accounting',
    component: AccountingComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Solicitud',
          url: principalMonetizaor
        },
        {
          label: 'accounting',
          url: ''
        }
      ]
    } 
  },
  {
    path: '/monetizador/monetization',
    component: MonetizationComponent,   
    data:{
      title:'Solicitud',
      breadcrumb:[
        {
          label: 'Inicio',
          url: 'inicio'
        },
        {
          label: 'Solicitud',
          url: principalMonetizaor
        },
        {
          label: 'monetization',
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
