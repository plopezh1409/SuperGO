import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    mostrarMenu = false;
    titulo: any;
    constructor(){
        this.titulo = '';
    }

    myObservable = Observable.create((observer: Observer<Array<string | number>>) => {
        setInterval(() => {
            let date = new Date();
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            date = new Date();
            const fechaHora = [date.getDate(), meses[date.getMonth()], date.getFullYear(), date.getHours(), date.getMinutes()];
            for (let i = 0; i < fechaHora.length; i++){
                if(fechaHora[i].toString().length === 1){
                    const aux = fechaHora[i];
                    fechaHora[i] = '0' + aux;
                }
                observer.next(fechaHora);
            }
        }, 1000)
    });

    showMenuLogOut(){
        this.mostrarMenu = !this.mostrarMenu;
    }
}