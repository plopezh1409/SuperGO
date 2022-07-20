export class Tablero {
    idTipo: number;
    descripcionTipo: string;
    razonSocial: string;
    fechaContable: string;
    fechaOperativa: string;
    numeroOperaciones: number;
    montoOperaciones: number;
    tipoStatus: string;
    descripcionStatus: string;
    documentoContable: string;
    cuentaBalance: string;
    cuentaResultados: string;
    detallesOperaciones: DetallesOperacione[];


    constructor() {
        this.idTipo = 0;
        this.descripcionTipo = '';
        this.razonSocial = '';
        this.fechaContable = '';
        this.fechaOperativa = '';
        this.numeroOperaciones = 0;
        this.montoOperaciones = 0;
        this.tipoStatus = '';
        this.documentoContable = '';
        this.cuentaBalance = '';
        this.cuentaResultados = '';
        this.descripcionStatus = '';
        this.detallesOperaciones = [];
    }
}



export interface Notificacione {
    notificacion: string;
    mensaje: string;
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

export interface TableroCifra {
    idTipo: number;
    descripcionTipo: string;
    razonSocial: string;
    fechaContable: string;
    fechaOperativa: string;
    numeroOperaciones: number;
    montoOperaciones: number;
    documentoContable: string;
    cuentaBalance: string;
    cuentaResultados: string;
    tipoStatus: string;
    descripcionStatus: string;
    detallesOperaciones: DetallesOperacione[];
}

export interface DatosDeSalida {
    tableroCifras: TableroCifra[];
    tiempoEjrn: number;
    tiempoObdt: number;
    tiempoDeMicro: number;
}

export interface RootObject {
    notificaciones: Notificacione[];
    datosDeSalida: DatosDeSalida;
}



