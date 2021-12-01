export class Usuario {
    session: string;
    numeroEmpleado: string;
    nombre: string;
    p4ss: string;
    idRol: string;
    rol: string[];
    idPais: string;
    pais: string;
    idUnidadNegocio: string;
    unidadNegocio: string;
    estatus: number;
    empresa: string;
    idEmpresa: string;
    idtipo: string;
    tipo: string;
    navegador: string;
    dispositivo: string;
    usuario: string; //USUARIO AUXILIAR UTILIZADO EN LOGIN SYS

    constructor() {
        this.session = '';
        this.numeroEmpleado = '';
        this.nombre = '';
        this.p4ss = '';
        this.idRol = '';
        this.rol = [];
        this.idPais = '';
        this.pais = '';
        this.idUnidadNegocio = '';
        this.unidadNegocio = '';
        this.estatus = 0;
        this.empresa='';
        this.idEmpresa = '';
        this.idtipo = '';
        this.tipo = '';
        this.navegador = '';
        this.dispositivo = '';
        this.usuario = '';
    }
}