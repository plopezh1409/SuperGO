export class Monetizacion
{
    idSociedad:number;
    razonSocial:string;
    idTipo:number;
    descripcionTipo:string;
    idSubtipo:number;
    descripcionSubtipo:string;
    indicadorOperacion:string;
    montoMonetizacion:number;
    tipoMonto:string;
    idTipoImpuesto:number;
    emisionFactura:boolean;
    segmento:number;
    codigoDivisa:string;
    periodicidadCorte:string;
    fechaFin:string;
    fechaInicio:string;
    idReglaMonetizacion:number;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = '';
        this.idTipo = 0;
        this.descripcionTipo = '';
        this.idSubtipo = 0;
        this.descripcionSubtipo = '';
        this.segmento = 0;
        this.tipoMonto = '';
        this.montoMonetizacion = 0;
        this.idTipoImpuesto = 0;
        this.codigoDivisa = '';
        this.emisionFactura = false;
        this.indicadorOperacion = '';
        this.periodicidadCorte = '';
        this.idReglaMonetizacion = 0;
        this.fechaFin = '01/01/0001';
        this.fechaInicio = '01/01/0001';
    }
    
}