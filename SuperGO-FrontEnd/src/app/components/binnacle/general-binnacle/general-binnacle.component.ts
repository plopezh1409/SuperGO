import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';

@Component({
  selector: 'app-general-binnacle',
  templateUrl: './general-binnacle.component.html',
  styleUrls: ['./general-binnacle.component.sass']
})
export class GeneralBinnacleComponent implements OnInit, OnChanges {
  public response;
  public cards: any[];
  public filters: any[];
  search = '';
  cardsClean: any = [];

  constructor(
    private readonly appComponent: AppComponent,
    private readonly binnacleService: BinnacleService
  ) {
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;

    this.response = '';
    this.cards = [];
    this.filters = [];
  }

  ngOnInit(): void {
    this.getCards();
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  getCards() {
    this.cardsClean = this.cards;
  }

  receiveCards($event: any) {
    this.cards = $event;
  }

  receiveCardsF($event: any) {
    this.cardsClean = $event;
  }

  onKey(input: any) {
    this.cardsClean = [];
    this.cards.forEach((el: any) => {
      let encontrado = false;
      for(const content of el.content)
      {
        const element = content.value;
        const cadena = element.toLowerCase();
        const t1 = input.target.value.trim();
        const pos1 = cadena.indexOf(t1);
        if (pos1 != -1) {
          encontrado = true;
        }
      }
      
      const folioLower = el.header.invoice.toLowerCase();
      const t2 = input.target.value.trim();
      const pos2 = folioLower.indexOf(t2);
      if (pos2 != -1) {
        encontrado = true;
      }

      // for (let i = 0; i < el.solicitude.length; i++) {
      //   const element = el.solicitude[i];
      //   element.section.forEach((x: any) => {
      //     let cadena = x.value.toLowerCase();
      //     let termino = input.target.value.trim();
      //     let posicion = cadena.indexOf(termino);
      //     if (posicion != -1) {
      //       encontrado = true
      //     }

      //   });
      // }
      if (encontrado) {
        this.cardsClean.push(el);
      }
    });
  }

}
