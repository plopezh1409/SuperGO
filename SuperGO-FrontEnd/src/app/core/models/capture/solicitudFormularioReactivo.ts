export class SolicitudFormularioReactivo {
  public pais: string;
    public area: string;
    public paisOperativa: string;
    public areaOperativa : string;
    public solicitud: string;
    public tipoSolicitud: string;
    public subTipoSolicitud: string;
 
  constructor(obj:{
    pais:string;
    area: string;
    paisOperativa: string;
    areaOperativa : string;
    solicitud: string;
    tipoSolicitud: string;
    subTipoSolicitud: string;}) 
    {
      this.pais = obj.pais;
      this.area = obj.area;
      this.paisOperativa=obj.paisOperativa;
      this.areaOperativa = obj.areaOperativa;
      this.solicitud=obj.solicitud;
      this.tipoSolicitud=obj.tipoSolicitud;
      this.subTipoSolicitud=obj.subTipoSolicitud;
  }
}
