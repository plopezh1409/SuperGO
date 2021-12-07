import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaNoEncontradaComponent } from '@app/shared/pagina-no-encontrada/pagina-no-encontrada.component';
import {InicioComponent} from '@app/core/layout/inicio/inicio.component';
import { TestComponent } from '@app/shared/test/test.component';

const routes: Routes = [ 
  {
    path: 'login',
    loadChildren: () => import('@app/components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'catalogos',
    loadChildren: () => import('@app/components/catalogs/catalogs.module').then(m => m.CatalogsModule)
  },
  {
    path: 'bills',
    loadChildren: () => import('@app/components/bill/bill.module').then(m => m.BillModule)
  },
  {
    path: 'operations',
    loadChildren: () => import('@app/components/operation/operation.module').then(m => m.OperationModule)
  },
  {
    path: 'accounting',
    loadChildren: () => import('@app/components/accounting/accounting.module').then(m => m.AccountingModule)
  },
  {
    path: 'monetization',
    loadChildren: () => import('@app/components/monetization/monetization.module').then(m => m.MonetizationModule)
  },
  {
    path: '', component:InicioComponent,
  },
  {
    path: 'inicio', component:InicioComponent,
  },
  {
    path:'web/test', component:TestComponent
  },
  { path: '**', component: PaginaNoEncontradaComponent }, //RUTA 40 
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
