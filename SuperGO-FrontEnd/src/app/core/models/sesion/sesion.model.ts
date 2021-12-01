import { User } from '../public/user.model';

export class Sesion {
    public token: string;
    public usuario: User;

    constructor(){
        this.token = '';
        this.usuario = new User();
    }
}
