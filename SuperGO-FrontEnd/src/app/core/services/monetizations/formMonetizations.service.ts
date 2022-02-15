import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
//ENVIROMENT
import { environment } from '@env/environment';

//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';
import { Monetizacion } from "@app/core/models/monetizacion/monetizacion.model";

@Injectable({
    providedIn:'root'
})
export class FormMonetizationsService{

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
        return { "idRequest": "17" };
    }

    getForm():Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, this._requestForm);
    }


    getDataMonetization():Observable<any>
    {
        return this.httpClient.get('assets/dataTables/dataMonetization.json');
    }

    getDataMonetizationById(dataMonetization:Monetizacion):Observable<any>
    {
        return this.httpClient.get('assets/dataTables/dataMonetizationBusqueda.json');
                // return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataMonetization);
    }

}