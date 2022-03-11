import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from '../../models/public/rol.model';

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private urlEndPoint = environment.urlSuperGo;
    constructor(private http: HttpClient) { }
    
    adminRoles(rol:Rol):Observable<any>
    {
        return this.http.post(`${this.urlEndPoint}administraGO/rol`, rol);   
    }
}