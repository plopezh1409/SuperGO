import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogsComponent } from './catalogs.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [{
  path:'', component: CatalogsComponent,
  children:[{
    path:'',component: GeneralComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
