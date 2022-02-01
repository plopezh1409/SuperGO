export class Facturas
{
    idSociedad:number;
    idTipoOperacion:number;
    idSubTipoOperacion:number;
    tipoComprobante:number;
    tipoFactura:number;

    constructor(){
        this.idSociedad = 0;
        this.idTipoOperacion = 0;
        this.idSubTipoOperacion = 0;
        this.tipoComprobante = 0;
        this.tipoFactura = 0;
    }

}