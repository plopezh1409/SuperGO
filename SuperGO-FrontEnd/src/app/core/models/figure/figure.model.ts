import { triggerAsyncId } from "async_hooks";

export class Tablero
{
    idTipo: number;
    descripcionTipo: string;
    idSubtipo: number;
    razonSocial: string;
    fechaOperacion: string;
    fechaContable: string;
    fechaCorte: string;
    semana: number;
    numeroOperaciones: number;
    montoMonetizaciones: number;
    totalIVA: number;
    montosTotales :number;
    montoOperaciones: number;
    montoMonetizacion: number;
    iva: number;
    montoTotal: number;
    documentoContable: string;
    estatusContabilizacion: string;
    cuentaBalance: string;
    montoBalance: number;
    cuentaResultados: string;
    montoResultados: number;
    detallesOperaciones: DetallesOperacione[];
    operaciones: Operaciones[];
    tipoStatus: string;
    descripcionStatus: string;
   
    constructor(){
       this.idTipo=0;
       this.descripcionTipo='';
       this.idSubtipo=0;
       this.razonSocial='';
       this.fechaOperacion='';
       this.fechaContable='';
       this.fechaCorte='';
       this.semana=0;
       this.numeroOperaciones=0;
       this.montoOperaciones=0;
       this.montoMonetizaciones =0;
       this.totalIVA=0;
       this.montosTotales=0;
       this.montoMonetizacion=0;
       this.iva=0;
       this.montoTotal=0;
       this.documentoContable='';
       this.estatusContabilizacion='';
       this.cuentaBalance='';
       this.montoBalance=0;
       this.cuentaResultados='';
       this.montoResultados=0;
       this.detallesOperaciones=[];
       this.operaciones=[];
       this.tipoStatus='';
       this.descripcionStatus='';
    }
}

export interface Notificacione {
    notificacion: string;
    mensaje: string;
}

export interface Operaciones {
    idTipo: number;
    descripcionTipo: string;
    idSubtipo: number;
    descripcionSubtipoOperacion: string;
}

export interface DetallesOperacione {
    numeroOperacion: number;
    montoOperacion: number;
    montoMonetizacion: number;
    iva: number;
    montoTotal: number;
    suid: string;
    sicu: string;
}

export interface TableroOperativo {
    idTipo: number;
    descripcionTipo: string;
    idSubtipo: number;
    razonSocial: string;
    fechaOperacion: string;
    fechaContable: string;
    fechaCorte: string;
    semana: number;
    numeroOperaciones: number;
    montoOperaciones: number;
    montoMonetizaciones: number;
    totaliva: number;
    montosTotales: number;
    documentoContable: string;
    estatusContabilizacion: string;
    cuentaBalance: string;
    montoBalance: number;
    cuentaResultados: string;
    montoResultados: number;
    detallesOperaciones: DetallesOperacione[];
}

export interface DatosDeSalida {
    operaciones: Operaciones;
    tableroOperativo: TableroOperativo[];
    tiempoEjrn: number;
    tiempoObdt: number;
    tiempoDeMicro: number;
}

export interface Example {
    notificaciones: Notificacione[];
    datosDeSalida: DatosDeSalida;
}