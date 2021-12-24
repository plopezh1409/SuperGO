export class Solicitud {
    idSolicitud: string; //FOLIO DE SOLICITUD
    fechaCarga: string;
    tipoSolicitud: string;
    importe: number;
    usuario: string;
    noEmpleado: string;
    estatus: string;

    constructor(object: any){
        this.idSolicitud = (object.idSolicitud) ? object.idSolicitud : null;
        this.fechaCarga = (object.fechaCarga) ? object.fechaCarga : null;
        this.tipoSolicitud = (object.tipoSolicitud) ? object.tipoSolicitud : null;
        this.importe = (object.importe) ? object.importe : null;
        this.usuario = (object.usuario) ? object.usuario : null;
        this.noEmpleado = (object.noEmpleado) ? object.noEmpleado : null;
        this.estatus = (object.estatus) ? object.estatus : null;
    }
}