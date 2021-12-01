export class Rol {
    public idRol: string|null;
    public nombre: string|null;
    public tipo: string|null;
    public idTipoRol: string|null;
    public estatus:string|null;

    constructor() {
        this.idRol = '';
        this.nombre = '';
        this.tipo = '';
        this.idTipoRol = '';
        this.estatus = '1';      
    }
}