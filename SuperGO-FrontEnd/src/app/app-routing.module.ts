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
