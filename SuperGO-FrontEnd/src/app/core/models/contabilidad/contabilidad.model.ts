export class Contabilidad
{
    idSociedad:number;
    idTipoOperacion:number;
    idSubtipoOperacion:number;
    idReglaMonetizacion:number;
    contabilidadDiaria:string;
    numeroApunte:number;
    sociedad:string;
    tipoCuenta:string;
    cuentaSAP:string;
    claseDocumento:string;
    concepto:string;
    centroDestino:string;
    indicadorIVA:string;
    indicadorOperacion:string;

    constructor(){
        this.idSociedad = 0;
        this.idTipoOperacion = 0;
        this.idSubtipoOperacion = 0;
        this.idReglaMonetizacion = 0;
        this.contabilidadDiaria = "";
        this.numeroApunte = 0;
        this.sociedad = "";
        this.tipoCuenta = "";
        this.cuentaSAP = "";
        this.claseDocumento = "";
        this.concepto = "";
        this.centroDestino = "";
        this.indicadorIVA = "";
        this.indicadorOperacion = "";
    }

}