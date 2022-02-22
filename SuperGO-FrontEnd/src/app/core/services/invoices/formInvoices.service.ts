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

export class FormInvoicesService {
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
        return { "idRequest": "15" };
    }
	
	
	getForm(solicitud:any):Observable<any>
    {
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, solicitud);
    }

    getInfoInvoices(){
        return this.httpClient.get('/assets/dataTables/dataInvoices.json');
    }

    insertInvoice(dataInvoice:any){
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataInvoice);
    }

    updateInvoce(dataInvoice:any){
        return this.httpClient.post(`${this.urlEnviroment}reactiveForm`, dataInvoice);
    }

    // getForm():Observable<any>
    // {
    //     return this.httpClient.get('assets/json/jsonFacturas.json');
    // }

}