export class ACH{
    public cuentaO?:string;
    public codigo?:string;
    public monto?:string;
    public cuentaB?:string;
    public nombreB?:string;
    public referencia?:string;

    constructor(obj:{cuentaO?:string, codigo?:string, monto?:string, cuentaB?:string, nombreB?:string, referencia?:string}={}){
        this.cuentaO = obj.cuentaO;
        this.codigo = obj.codigo;
        this.monto = obj.monto;
        this.cuentaB = obj.cuentaB;
        this.nombreB = obj.nombreB;
        this.referencia = obj.referencia;
    }
}

