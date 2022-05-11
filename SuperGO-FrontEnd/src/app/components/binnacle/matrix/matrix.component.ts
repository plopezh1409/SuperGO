import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.sass']
})
// 0  rechazado
// 2 pendiente
// 1 autorizado

export class MatrixComponent implements OnInit, OnChanges {

  @Input() matrix: any;
  public rep: boolean;
  public cardM: string;
  public cardM2: string;  
  constructor(public binnacleService: BinnacleService) 
  { 
    this.rep = false; 
    this.cardM = ''; 
    this.cardM2 = ''; 
  }

  ngOnInit(): void {
    // This is intentional
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ordenar();
    
  }

  URL(enterprise: string, id: string) {
    if (enterprise !== undefined && id != undefined) {
      return (`https://portal.socio.gs/foto/${enterprise}/empleados/${id}.jpg`);
    } else {
      return (`assets/image/account_circle-24px.svg`);
    }
  }



  GetSortOrder(prop: any) {
    return function (a: any, b: any) {
      if (a[prop] > b[prop]) {
        return 1;
      } else {
        if (a[prop] < b[prop])
        {
          return -1;
        }        
      }
      return 0;
    };
  }

  ordenar() {
    this.matrix.sort(this.GetSortOrder('level'));
    const cont = 0;
    this.cardM = `<div style=" display: flex;flex-wrap: wrap; justify-content: center;">`;
    this.cardM2 = ` </div>`;
  }

}
