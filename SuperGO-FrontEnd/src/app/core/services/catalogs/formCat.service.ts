import { HttpClient, HttpHeaders } from "@angular/common/http";
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

    httpHeaders = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
        })
    }

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

    getForm():Observable<any>
    {
        let dataBody = { "idRequest": "13" };
        // var body = JSON.stringify(dataBody);
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataBody);
        // return this.httpClient.post(`http://10.112.69.189:8080/reactiveForm`, dataBody);
    }

    // getForm():Observable<any>
    // {
    //     return this.httpClient.get('assets/json/jsonSociedades.json');
    // }


    getData():Observable<any>
    {
        return this.httpClient.get('/assets/dataTables/dataCatalog.json');
    }

    getDataSociedad(body:any):Observable<any>
    {
        return this.httpClient.post<Sociedad>('http://10.112.209.251:8081/sociedades/test', body, this.httpHeaders);
    }

    // getData():Observable<any>
    // {
    //     return this.httpClient.post(`${this.urlEnviroment}metodo`,catalog);
    // }

    insertRecord(catalog:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}metodo`,catalog);
    }

    updateRecord(catalog:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}metodo`,catalog);
    }

}