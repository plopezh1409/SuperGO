import { Sociedad } from '../catalogos/sociedad.model';

export class SocietiesResponse {
   
   sociedades: Sociedad[];

   constructor(){
      this.sociedades = [];   
   }

   setSociedades(sociedades:Sociedad[]){
      this.sociedades = sociedades;
   }

   getSociedades(): Sociedad[]{
      return this.sociedades;
   }
}
