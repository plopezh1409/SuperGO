import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Pais } from '../../models/public/pais.model';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Injectable({
    providedIn: 'root'
})
export class PaisService {
    private urlEndPoint = environment.urlSuperGo;
    private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
    constructor(protected http: HttpClient) { }

    getPaises(): Observable<any> {
        return this.http.post(`${this.urlEndPoint}catPais`,{}).pipe(
            catchError(e => {
                if (e.status === this.codeResponse.RESPONSE_CODE_400) {
                    return throwError(e);
                }
                if (e.error.mensaje) {
                  
                }
                return throwError(e);
            }));
    }

    adminPais(pais:Pais):Observable<any>
    {
        return this.http.post(`${this.urlEndPoint}administraGO/pais`, pais);
    }
}