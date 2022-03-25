import { Sociedad } from "../catalogos/sociedad.model";
import { Monetizacion } from "../monetizacion/monetizacion.model";

export class MonetizationResponse {
   reglas: Monetizacion[];
   sociedades: Sociedad[];

   constructor(){
      this.reglas = [];
      this.sociedades = [];
   }

   setSociedades(sociedades:Sociedad[]){
      this.sociedades = sociedades;
   }

   setMonetizacion(reglas:Monetizacion[]){
      this.reglas = reglas;
   }

   getSociedades(): Sociedad[]{
      return this.sociedades;
   }

   getMonetizacion(): Monetizacion[]{
      return this.reglas;
   }

}
