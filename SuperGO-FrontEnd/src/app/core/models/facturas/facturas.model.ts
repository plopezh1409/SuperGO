export class Facturas
{
    idSociedad:number;
    razonSocial:string;
    idTipo:number;
    descripcionTipo:string;
    idSubtipo:number;
    descripcionSubtipo:string;
    idReglaMonetizacion:number;
    tipoComprobante:number;
    tipoFactura:number;
    codigo: string;
    usoCFDI: string;
    descripcionFactura: string;
    claveServicio: string;
    metodo: string;
    fecha: string;
    usuario: string;

    constructor(){
        this.idSociedad = 0;
        this.idTipo = 0;
        this.idSubtipo = 0;
        this.idReglaMonetizacion = 0;
        this.tipoComprobante = 0;
        this.tipoFactura = 0;
        this.razonSocial = '';
        this.descripcionSubtipo = '';
        this.descripcionTipo = '';
        this.codigo = '';
        this.metodo = '';
        this.claveServicio = '';
        this.descripcionFactura = '';
        this.usoCFDI = '';
        this.fecha = '';
        this.usuario = '';
    }

}