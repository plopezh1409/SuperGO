
export class Archivo {
  public informacion: File;
  public estatus: string;
  public enProceso: boolean;
  public proceso: number;
  public reintentar: boolean;
  public cancelar: boolean;

  constructor(opciones: {
    informacion: File,
    estatus: string,
    enProceso: boolean,
    proceso: number,
    reintentar: boolean,
    cancelar: boolean}) {
    this.informacion = opciones.informacion;
    this.estatus = opciones.estatus;
    this.enProceso = opciones.enProceso;
    this.proceso = opciones.proceso;
    this.reintentar = opciones.cancelar;
    this.cancelar = opciones.cancelar;
  }
}
