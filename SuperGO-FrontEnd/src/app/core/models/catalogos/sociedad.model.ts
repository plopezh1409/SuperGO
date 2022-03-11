export class Sociedad
{
    idSociedad:number;
    razonSocial:string;
    RFC:string;
    idTipoSociedad:number;
    descripcionTipoSociedad:string;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = '';
        this.RFC = '';
        this.descripcionTipoSociedad = '';
        this.idTipoSociedad = 0;
    }
}