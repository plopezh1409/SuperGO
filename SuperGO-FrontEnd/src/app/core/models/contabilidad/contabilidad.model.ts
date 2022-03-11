export class Contabilidad
{
    idSociedad:number;
    idTipoOperacion:number;
    idSubtipoOperacion:number;
    idReglaMonetizacion:number;
    razonSocial:string;
    descripcionTipoOperacion:string;
    descSubTipoOperacion:string;
    contabilidadDiaria:string;
    numeroApunte:number;
    sociedadGl:string;
    tipoCuenta:string;
    indicadorOperacion:string;
    claseDocumento:string;
    concepto:string;
    centroDestino:string;
    indicadorIVA:string;
    cuentaSAP:string;

    constructor(){
        this.idSociedad = 0;
        this.idTipoOperacion = 0;
        this.idSubtipoOperacion = 0;
        this.idReglaMonetizacion = 0;
        this.contabilidadDiaria = '';
        this.numeroApunte = 0;
        this.sociedadGl = '';
        this.tipoCuenta = '';
        this.cuentaSAP = '';
        this.claseDocumento = '';
        this.concepto = '';
        this.centroDestino = '';
        this.indicadorIVA = '';
        this.indicadorOperacion = '';
        this.razonSocial = '';
        this.descripcionTipoOperacion='';
        this.descSubTipoOperacion = '';
    }

}