import { IResponseData } from "./iresponse-data.model";
import { Operaciones } from "../operaciones/operaciones.model";
import { Sociedad } from "../catalogos/sociedad.model";

export class OperationsResponse{

   tipoOperacion: Operaciones[];
   sociedades: Sociedad[];

   constructor(){
      this.tipoOperacion = [];
      this.sociedades = [];   
   }

   setSociedades(sociedades:Sociedad[]){
      this.sociedades = sociedades;
   }

   setOperaciones(operaciones:Operaciones[]){
      this.tipoOperacion = operaciones;
   }

   getSociedades(): Sociedad[]{
      return this.sociedades;
   }

   getOperaciones(): Operaciones[]{
      return this.tipoOperacion;
   }
}
