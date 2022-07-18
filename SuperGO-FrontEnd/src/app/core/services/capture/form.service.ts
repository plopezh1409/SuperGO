import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SolicitudFormularioReactivo } from '../../models/capture/solicitudFormularioReactivo';
import { AuthService } from '../sesion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private urlEndPoint: any;
  private httpHeaders: HttpHeaders;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient, authservice:AuthService)
  {
    this.httpClient = httpClient;
    this.httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });    
    this.urlEndPoint = authservice.urlEnviroment;
   }

   getFormByPetition(request:Object){
    return this.httpClient.post<any>(`${this.urlEndPoint}reactiveForm`, request);
   }

   getFormByModule(request:Object){    
    
    return this.httpClient.post<any>(`${this.urlEndPoint}reactiveModule`, request);
   }  

   getFieldQuery(consulta: string, obj?:Object): Observable<any> {    
    if(obj===null)
    {
      return this.httpClient.get<any>(`${this.urlEndPoint}${consulta}`,
     {headers: this.httpHeaders});
    }
    else
    {
      return this.httpClient.post<any>(`${this.urlEndPoint}${consulta}`, obj,
      {headers: this.httpHeaders});
    }
  }

  



}
