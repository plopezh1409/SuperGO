import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingsComponent } from './accountings/accountings.component';
import { GeneralAccountingComponent } from './general-accounting/general-accounting.component';

const routes: Routes = [{
  path:'', component: AccountingsComponent,
  children:[{
    path:'',component: GeneralAccountingComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
