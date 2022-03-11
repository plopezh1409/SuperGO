export class Operaciones
{
    idTipoOperacion:number;
    descripcionTipoOperacion:string;
    idCanal:number;
    topicoKafka:string;
    status:string;

    constructor(){
        this.idTipoOperacion = 0;
        this.descripcionTipoOperacion = '';
        this.idCanal=0;
        this.topicoKafka='';
        this.status='I';
    }

}