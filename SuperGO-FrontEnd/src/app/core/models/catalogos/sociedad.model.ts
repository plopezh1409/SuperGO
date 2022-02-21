export class Sociedad
{
    idSociedad:number;
    razonSocial:string;
    rfc:string;
    idTipoSociedad:number;
    descripcionTipoSociedad:string;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = "";
        this.rfc = "";
        this.descripcionTipoSociedad = "";
        this.idTipoSociedad = 0;
    }
}