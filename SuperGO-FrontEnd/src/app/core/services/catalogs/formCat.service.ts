import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';

@Injectable({
    providedIn:'root'
})
export class FormCatService{
    // urlApi:string = "https://api.dev-supercore.com/desarrollo/supercore/monetizador/gestion-sociedades/v1/sociedades";
    constructor(public httpClient:HttpClient)
    {}

    getForm():Observable<any>
    {
        return this.httpClient.get('assets/json/jsonSociedades.json');
    }

    getData():Observable<any>
    {
        return this.httpClient.get('/assets/dataTables/dataCatalog.json');
    }

    sendData(catalog:any):Observable<any>
    {
        var urlApi ="";
        return this.httpClient.post(urlApi,catalog);
    }

}