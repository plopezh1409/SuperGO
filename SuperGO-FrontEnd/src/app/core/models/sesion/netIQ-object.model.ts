export class NetIqObject {
    public usuario: string;
    public token: string;

    constructor(object: any) {
        this.usuario = (object.usuario) ? object.usuario : null;
        this.token = (object.token) ? object.token : null;
    }
}