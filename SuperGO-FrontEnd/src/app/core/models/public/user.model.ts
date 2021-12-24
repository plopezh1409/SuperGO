import { Country } from "./country.model";
import { Direction } from "./direction.model";
import { Page } from "./page.module";


export class User {
    employee:string;
    name:string;
    direction:Direction;
    country:Country;
    company:string;
    modules:Page[];
    top:Page[];
    user:string; //USUARIO AUXILIAR UTILIZADO EN LOGIN SYS
    p4ss: string;


/*
    session: string;
    numeroEmpleado: string;
    nombre: string;
    
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
    usuario: string; */

    constructor() {
        this.employee = "";
        this.name = "";
        this.direction = {} as Direction;
        this.country = {} as Country;
        this.company = "";
        this.modules = [];
        this.top = [];
        this.user = "";   
        this.p4ss = "";   
    }
}