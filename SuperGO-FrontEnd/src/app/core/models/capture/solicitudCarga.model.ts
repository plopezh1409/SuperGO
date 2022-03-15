export class SolicitudCarga {
  public requiereEvidencia:string;
  constructor(
    public empleado:string,
    private pais: string,
    private transacciones: string[],
    private area: string,
    private paisOperativa: string,
    private areaOperativa:string,
    private solicitud:string,
    private tipoSolicitud:string,
    private subTipoSolicitud:string,
    private rolActivo:string 
  ) {
    this.requiereEvidencia = '1';
  }
}
