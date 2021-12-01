import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../sesion/auth.service';

@Injectable({
    providedIn: 'root'
  })
export class UsuarioService {
    private urlEndPoint:any;
    constructor(private http: HttpClient, authservice:AuthService) {
        this.urlEndPoint = authservice.urlEnviroment;
    }

    modifyTop(top: any,type:string): Observable<any> {
        console.log("modifyTop",top);
         return this.http.post(`${this.urlEndPoint}top/${type}`, top);
    }

}