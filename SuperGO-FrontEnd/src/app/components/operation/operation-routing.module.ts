import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralOperationsComponent } from './general-operations/general-operations.component';
import { OperationsComponent } from './operations/operations.component';

const routes: Routes = [{
  path:'', component: OperationsComponent,
  children:[{
    path:'',component: GeneralOperationsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
