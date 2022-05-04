import { Sociedad } from '../catalogos/sociedad.model';
import { TipoSociedad } from '../catalogos/tipo-sociedad.model';

export class SocietiesResponse {
   
   sociedades: Sociedad[];
   sociedadesSap: Sociedad[];
   tipoSociedades: TipoSociedad[];
   constructor(){
      this.sociedades = [];
      this.tipoSociedades = [];
      this.sociedadesSap = [];
   }

   setSociedades(sociedades:Sociedad[]){
      this.sociedades = sociedades;
   }

   getSociedades(): Sociedad[]{
      return this.sociedades;
   }

   setTipoSociedades(sociedades:Sociedad[]){
      this.sociedades = sociedades;
   }

   getTipoSociedades(): Sociedad[]{
      return this.sociedades;
   }
}
