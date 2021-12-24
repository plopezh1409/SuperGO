export class UnidadNegocio {
    public idPais: string|null;
    public idUnidad: string|null;
    public nombre: string|null;
    public depto: number|null;
    public estatus:string|null;

    constructor() {
        this.idPais='';
        this.idUnidad='';
        this.nombre='';
        this.depto=0; 
        this.estatus = '1';      
    }
}