import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsComponent } from './bills/bills.component';
import { GeneralBillsComponent } from './general-bills/general-bills.component';

const routes: Routes = [{
  path:'', component: BillsComponent,
  children:[{
    path:'',component: GeneralBillsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }



