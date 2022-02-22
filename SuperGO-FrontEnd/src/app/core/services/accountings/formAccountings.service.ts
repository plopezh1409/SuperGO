import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
//ENVIROMENT
import { environment } from '@env/environment';
//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';

import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';

@Injectable({
    providedIn:'root'
})
export class FormAccountingsService{
    private readonly angularSecurity: AngularSecurity;
    private _urlEnviroment:string|null;

    constructor(public httpClient:HttpClient,  public injector:Injector)
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
        return { "idRequest": "16" };
    }

    getForm(solicitud:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, solicitud);

    }

    getInfoAccounting()
    {
        return this.httpClient.get('/assets/dataTables/dataAccounting.json');
    }

    getAccountingById(dataAccount:Contabilidad)
    {
        return this.httpClient.get('/assets/dataTables/dataAccountingBusqueda.json');
        // return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataAccounting);
   
    }

    insertAccounting(dataAccounting:Contabilidad)
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataAccounting);
    }

    updateAccounting(dataAccounting:Contabilidad){
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataAccounting);
    }



}