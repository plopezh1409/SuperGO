import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Sociedad }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             from '@app/core/models/catalogos/sociedad.model';
//ENVIROMENT
import { environment } from '@env/environment';

//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';
@Injectable({
    providedIn:'root'
})
export class FormCatService{
    private readonly angularSecurity: AngularSecurity;
    private _urlEnviroment:string|null;

    constructor(public httpClient:HttpClient, public injector:Injector)
    {
        this._urlEnviroment = null;
        this.angularSecurity = this.injector.get<AngularSecurity>(AngularSecurity);
    }

    public get urlEnviroment()
    {
        if(this._urlEnviroment!=null)
        {
            return this._urlEnviroment;
        }
        else
        {
            const urlCle = this.angularSecurity.getKeyAES;
            this._urlEnviroment = this.angularSecurity.decryptAES(environment.urlSuperGo, urlCle);
            return this._urlEnviroment;
        }
    }

    getForm(solicitud:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, solicitud);
    }

    getInfoSocieties():Observable<any>
    {
        return this.httpClient.get('/assets/dataTables/dataCatalog.json');
    }

    insertSociety(newSociety:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}metodo`,newSociety);
    }

    updateSociety(updateSociety:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}metodo`,updateSociety);
    }
}