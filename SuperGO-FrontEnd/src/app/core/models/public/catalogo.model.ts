export class Catalogo {
    public idCatalogo: number;
    public descripcion: string;
    public nombre: string;
    public detalle: string;
  
    constructor(idCatalogo: number, descripcion: string, nombre: string, detalle:string) {
      this.idCatalogo = idCatalogo;
      this.descripcion = descripcion;
      this.nombre = nombre;
      this.detalle = detalle;
    }
  }  