export class Autorizacion{
    idRol:string;
    rol:string;
    numEmpleado:string;
    nombre:string;
    estatus:string;
    comentario:string;
    fecha:string;
    unidadNegocio:string;   
    nivel:number; 
    constructor(){
        this.idRol='';
        this.rol='';
        this.numEmpleado='';
        this.nombre='';
        this.estatus='';
        this.fecha='';
        this.comentario='';
        this.unidadNegocio='';
        this.nivel = 0;
    }
} 