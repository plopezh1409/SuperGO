import { Sociedad } from '../catalogos/sociedad.model';
import { Contabilidad } from '../contabilidad/contabilidad.model';
import { Operaciones } from '../operaciones/operaciones.model';

export class AccountingResponse {
   contabilidad: Contabilidad[];
   operaciones: Operaciones[];
   sociedades: Sociedad[];

   constructor(){
      this.contabilidad = [];
      this.operaciones = [];
      this.sociedades = [];
   }
}