export class Resultado<T>{
    public codigoRespuesta: number;
    public mensajeRespuesta: string;
    public resultadoRespuesta: any;
    public erroresRespuesta: any;

    constructor(codigoRespuesta: number, mensajeRespuesta: string, resultadoRespuesta: any, erroresRespuesta: number) {
        this.codigoRespuesta = codigoRespuesta;
        this.mensajeRespuesta = mensajeRespuesta;
        this.resultadoRespuesta = resultadoRespuesta;
        this.erroresRespuesta = erroresRespuesta;
    }
}