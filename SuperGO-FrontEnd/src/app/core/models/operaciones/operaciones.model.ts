export class Operaciones
{
    idTipo:number;
    descripcionTipo:string;
    idCanal:number;
    topicoKafka:string;
    status:string;

    constructor(){
        this.idTipo = 0;
        this.descripcionTipo = '';
        this.idCanal=0;
        this.topicoKafka='';
        this.status='I';
    }

}