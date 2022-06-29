import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
//ENVIROMENT
import { environment } from '@env/environment';

//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';

@Injectable({
    providedIn:'root'
})
export class FormMonetizationsService{

    private readonly angularSecurity: AngularSecurity;
    private _urlEnviroment:string|null;
    private _urlServices:string|null;
    constructor(public httpClient:HttpClient, public injector:Injector)
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

    getDataMonetization():Observable<any>
    {
        // return this.httpClient.get(`${this.urlServices}reglas-monetizacion/get`);
        return this.httpClient.get('assets/dataTables/dataMonetization.json');
    }

    getDataMonetizationById(oMonetization:Monetizacion):Observable<any>
    {
        return this.httpClient.get('assets/dataTables/dataMonetizationBusqueda.json');
        // return this.httpClient.post(`${this.urlServices}reglas-monetizacion/post/Busqueda`, oMonetization);
    }

    insertMonetization(oMonetization:Monetizacion):Observable<any>
    {
        // return this.httpClient.get('assets/dataTables/dataMonetizationBusqueda.json');
        return this.httpClient.post(`${this.urlServices}reglas-monetizacion/post`, oMonetization);
    }

    updateMonetization(oMonetization:Monetizacion):Observable<any>
    {
        return this.httpClient.put(`${this.urlServices}reglas-monetizacion/put`, oMonetization);
    }

}