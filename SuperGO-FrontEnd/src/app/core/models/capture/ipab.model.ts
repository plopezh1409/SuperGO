export class IPAB{
    cuentas:any[];
    nombre:string;    
    marcajeActual:string;
    marcajeAAplicar:string;
    cliente:string;
    mensaje?:string

    constructor(obj?:{client:string; name:string;mark:string;accounts:any[]; message?:string})
    {
        this.nombre = obj ? obj!.name: '';
        this.marcajeActual = obj ? obj!.mark: '';
        this.marcajeAAplicar = '';
        this.cliente = obj ? obj!.client: '';
        this.cuentas = obj ? obj!.accounts.map(ac=> Object.assign({},{cuenta:ac.account, producto:ac.product})):[];   
        this.mensaje = obj ? obj!.message: '';  
    }
}