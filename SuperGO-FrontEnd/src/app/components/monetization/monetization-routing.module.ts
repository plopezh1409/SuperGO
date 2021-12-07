import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralMonetizationComponent } from './general-monetization/general-monetization.component';
import { MonetizationsComponent } from './monetizations/monetizations.component';

const routes: Routes = [{
  path:'', component: MonetizationsComponent,
  children:[{
    path:'',component: GeneralMonetizationComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonetizationRoutingModule { }
