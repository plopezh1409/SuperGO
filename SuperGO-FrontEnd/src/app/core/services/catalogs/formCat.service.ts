import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';

@Injectable({
    providedIn:'root'
})
export class FormCatService{
    urlEnviroment:string = "https://api.dev-supercore.com/desarrollo/supercore/monetizador/gestion-sociedades/v1/sociedades";
    httpHeaders = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'x-idAcceso': ''
        })
    }

    constructor(public httpClient:HttpClient)
    {
        this.httpHeaders.headers.set("x-idAcceso","nuevo");
    }

    getForm():Observable<any>
    {
        return this.httpClient.get('assets/json/jsonSociedades.json');
    }

    getData():Observable<any>
    {
        return this.httpClient.get('/assets/dataTables/dataCatalog.json', this.httpHeaders);
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