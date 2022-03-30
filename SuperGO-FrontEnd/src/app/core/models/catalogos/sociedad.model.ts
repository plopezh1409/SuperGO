export class Sociedad
{
    idSociedad:number;
    razonSocial:string;
    rfc:string;
    idTipo:number;
    descripcionTipo:string;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = '';
        this.rfc = '';
        this.descripcionTipo = '';
        this.idTipo = 0;
    }
}