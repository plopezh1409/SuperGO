import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent{
  version = '| Aplicacion Gestor de Operaciones FrontEnd 0.2.0, 2021 Banco Azteca. | Todos los derechos reservados.';  
  _date = new Date();
  fechaHora = `${this._date.toDateString()} - ${this._date.toLocaleTimeString()}`;
}
