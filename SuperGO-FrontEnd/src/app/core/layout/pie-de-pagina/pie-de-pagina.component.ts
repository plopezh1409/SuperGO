import { Component, Injector} from '@angular/core';
import { HeaderService } from '../../services/public/header.service';
@Component({
  selector: 'app-pie-de-pagina',
  templateUrl: './pie-de-pagina.component.html',
  styleUrls: ['./pie-de-pagina.component.sass']
})
export class PieDePaginaComponent {
  version = '2021 Banco Azteca. | Todos los derechos reservados.';
  fechaHora = [];
  public headerService: HeaderService;
  constructor(public injector:Injector ){
    this.headerService= this.injector.get<HeaderService>(HeaderService);

    this.headerService.myObservable.subscribe((data: any) => {
      this.fechaHora = data;
    });
  }
}
