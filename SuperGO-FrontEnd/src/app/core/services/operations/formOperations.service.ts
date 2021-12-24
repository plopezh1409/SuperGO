import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class FormOperationsService{
    constructor(public httpClient:HttpClient)
    {}

    getForm():Observable<any>
    {
        return this.httpClient.get('assets/json/jsonOperaciones.json');
    }

}