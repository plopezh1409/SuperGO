export class Monetizacion
{
    idSociedad:number;
    razonSocial:string;
    idTipoOperacion:number;
    descripcionTipoOperacion:string;
    idSubTipoOperacion:number;
    descSubTipoOperacion:string;
    indicadorOperacion:string;
    montoMonetizacion:number;
    tipoMontoMonetizacion:string;
    idTipoImpuesto:number;
    emisionFactura:boolean;
    segmento:number;
    codigoDivisa:string;
    periodicidadCorte:string;
    fechaFinVigencia:string;
    fechaInicioVigencia:string;

    constructor(){
        this.idSociedad = 0;
        this.razonSocial = "";
        this.idTipoOperacion = 0;
        this.descripcionTipoOperacion = "";
        this.idSubTipoOperacion = 0;
        this.descSubTipoOperacion = "";
        this.segmento = 0;
        this.tipoMontoMonetizacion = "";
        this.montoMonetizacion = 0;
        this.idTipoImpuesto = 0;
        this.codigoDivisa = "";
        this.emisionFactura = false;
        this.indicadorOperacion = "";
        this.periodicidadCorte = "";
        this.fechaFinVigencia = "01/01/0001";
        this.fechaInicioVigencia = "01/01/0001";
    }
    
}