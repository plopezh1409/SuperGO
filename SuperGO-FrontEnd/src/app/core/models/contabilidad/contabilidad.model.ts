export class Contabilidad
{
    idSociedad:number;
    idTipo:number;
    idSubtipo:number;
    idReglaMonetizacion:number;
    razonSocial:string;
    descripcionTipo:string;
    descripcionSubtipo:string;
    contabilidadDiaria:string;
    numeroApunte:number;
    sociedadGl:string;
    tipoCuenta:string;
    indicador:string;
    claseDocumento:string;
    concepto:string;
    centroDestino:string;
    indicadorIVA:string;
    cuentaSAP:string;
    fechaInicio:string;
    fechaFin:string;

    constructor(){
        this.idSociedad = 0;
        this.idTipo = 0;
        this.idSubtipo = 0;
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
        this.indicador = '';
        this.razonSocial = '';
        this.descripcionTipo='';
        this.descripcionSubtipo = '';
        this.fechaFin = '01/01/0001';
        this.fechaInicio = '01/01/0001';
    }

}