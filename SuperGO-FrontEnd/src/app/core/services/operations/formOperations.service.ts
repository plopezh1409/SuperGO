import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
//ENVIROMENT
import { environment } from '@env/environment';
//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';

@Injectable({
    providedIn:'root'
})
export class FormOperationsService{
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

    getForm():Observable<any>
    {
        let dataBody = { "idRequest": "14" };
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataBody);
    }

    getData():Observable<any>
    {
        return this.httpClient.get('/assets/dataTables/dataOperation.json');
    }

    insertOperation(dataBody:any):Observable<any>{
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataBody);
    }
}