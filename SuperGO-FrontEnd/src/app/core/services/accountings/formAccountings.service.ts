import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
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
    private _urlServices:string|null;

    constructor(public httpClient:HttpClient,  public injector:Injector)
    {
        this._urlEnviroment = null;
        this._urlServices = null;
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

    public get urlServices()
    {
        if(this._urlServices!=null)
        {
            return this._urlServices;
        }
        else
        {
            const urlCle = this.angularSecurity.getKeyAES;
            this._urlServices = this.angularSecurity.decryptAES(environment.urlServices, urlCle);
            return this._urlServices;
        }
    }

    getForm(solicitud:Object):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, solicitud);
    }

    getInfoAccounting():Observable<any>
    {
        // return this.httpClient.get(`${this.urlServices}Contabilidad/get`);
        return this.httpClient.get('/assets/dataTables/dataAccounting.json');
    }

    getAccountingById(dataAccounting:Contabilidad):Observable<any>
    {
        // return this.httpClient.post(`${this.urlServices}Contabilidad/post/Busqueda`, dataAccounting);
        return this.httpClient.get('/assets/dataTables/dataAccountingBusqueda.json');
    }

    insertAccounting(dataAccounting:Contabilidad):Observable<any>
    {
        return this.httpClient.post(`${this.urlServices}Contabilidad/post`, dataAccounting);
    }

    updateAccounting(dataAccounting:Contabilidad) :Observable<any>
    {
        return this.httpClient.put(`${this.urlServices}Contabilidad/put`, dataAccounting);
    }
    
    getMonetizacionRules(dataInvoice:Object):Observable<any>{
        return this.httpClient.post(`${this.urlServices}reglas-monetizacion/post/BusquedaReglas`, dataInvoice);
    }
}