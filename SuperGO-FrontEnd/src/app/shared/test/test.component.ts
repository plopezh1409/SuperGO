import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent{
  version = '| Aplicacion Super Gestor de Operaciones FrontEnd 0.0.1n, 2022 Banco Azteca. | Todos los derechos reservados.';  
  _date = new Date();
  fechaHora = `${this._date.toDateString()} - ${this._date.toLocaleTimeString()}`;
}
