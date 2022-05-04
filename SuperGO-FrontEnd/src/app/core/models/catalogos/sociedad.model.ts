export class Sociedad
{
    idSociedad:number;
    razonSocial:string;
    rfc:string;
    idTipo:number;
    descripcionTipo:string;
    idProveedorSAP: number;
    codigoPostal: string;
    fecha: string;
    usuario: string;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = '';
        this.rfc = '';
        this.descripcionTipo = '';
        this.idTipo = 0;
        this.idProveedorSAP = 0;
        this.codigoPostal = '';
        this.fecha = '';
        this.usuario = '';
    }
}