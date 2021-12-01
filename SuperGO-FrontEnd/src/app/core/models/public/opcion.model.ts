export class Opcion {
    public llave: number;
    public descripcion: string;
    public valor: string;
    // analizar idDdL
    constructor(llave: number, descripcion: string, valor: string) {
      this.llave = llave;
      this.descripcion = descripcion;
      this.valor = valor;
    }
  }  