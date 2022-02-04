import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
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

    private get _requestForm(){
        return { "idRequest": "13" };
    }

    getForm():Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, this._requestForm);
    }

    getInfoSocieties():Observable<any>
    {
        return this.httpClient.get('/assets/dataTables/dataCatalog.json');
    }

    insertSociety(catalog:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}metodo`,catalog);
    }

    updateSociety(catalog:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}metodo`,catalog);
    }

    // getForm():Observable<any> //JSON de prueba local FORMULARIO
    // {
    //     return this.httpClient.get('assets/json/jsonSociedades.json');
    // }

    // getInfoSocieties():Observable<any>
    // {
    //     return this.httpClient.post<Sociedad>('http://10.112.209.251:8081/sociedades/test', body, this.httpHeaders);
    // }

}