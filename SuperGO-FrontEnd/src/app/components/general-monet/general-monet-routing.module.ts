import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { societiescomponent } from './societies/societies.component';
import { HomeMonetizerComponent } from './home-monetizer/home-monetizer.component';
import { generalmonetComponent } from './general-monet.component';
import { invoicesComponent } from './invoices/invoices.component';

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
    path: 'monetizer',
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
    path: 'monetizer/invoices',
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
    path: 'monetizer/societies',
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
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetitionRoutingModule { }
