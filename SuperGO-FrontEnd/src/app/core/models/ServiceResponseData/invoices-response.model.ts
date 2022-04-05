import { Interface } from 'readline';
import { Sociedad } from '../catalogos/sociedad.model';
import { Facturas } from '../facturas/facturas.model';

export class InvoicesResponse {
   facturas: Facturas[];
   sociedades: Sociedad[];

   constructor(){
      this.facturas = [];
      this.sociedades = [];
   }

   setSociedades(sociedades:Sociedad[]){
      this.sociedades = sociedades;
   }

   setOperaciones(facturas:Facturas[]){
      this.facturas = facturas;
   }

   getSociedades(): Sociedad[]{
      return this.sociedades;
   }

   getFacturas(): Facturas[]{
      return this.facturas;
   }

}
