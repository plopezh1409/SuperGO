export class Sociedad
{
    idSociedad:number;
    razonSocial:string;
    RFC:string;
    idTipo:number;
    descripcionTipo:string;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = '';
        this.RFC = '';
        this.descripcionTipo = '';
        this.idTipo = 0;
    }
}