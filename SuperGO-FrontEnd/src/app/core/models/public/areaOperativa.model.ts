export class AreaOperativa
{
    public idArea?:string;
    public idPais?:string;
    public idAreaOperativa?:string;

    constructor(idPais?:string, idArea?:string, idAreaOperativa?:string)
    {        
        this.idPais = idPais;
        this.idArea = idArea;
        this.idAreaOperativa = idAreaOperativa;
        
    }
}