import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Moment } from 'moment';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SortModule {

  compare(a: number | string | Moment, b: number | string | Moment, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

 }
