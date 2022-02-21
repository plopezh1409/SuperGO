export class Facturas
{
    idSociedad:number;
    razonSocial:string;
    idTipoOperacion:number;
    descripcionTipoOperacion:string;
    idSubTipoOperacion:number;
    descSubTipoOperacion:string;
    idReglaMonetizacion:number;
    tipoComprobante:number;
    tipoFactura:number;

    constructor(){
        this.idSociedad = 0;
        this.idTipoOperacion = 0;
        this.idSubTipoOperacion = 0;
        this.idReglaMonetizacion = 0;
        this.tipoComprobante = 0;
        this.tipoFactura = 0;
        this.razonSocial = "";
        this.descSubTipoOperacion = "";
        this.descripcionTipoOperacion = "";
    }

}