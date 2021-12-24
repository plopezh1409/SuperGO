import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//SERVICIOS
import { AngularSecurity } from '../services/public/angularSecurity.service';
import { AngularSecurityRSAService } from '../services/public/angularSecurityRSA.service';
import { NGXLogger } from 'ngx-logger';
import { InterceptorUtils } from '../models/public/interceptorUtils.model';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    responseOK = [200, 201, 207, 227];
    private intercepUtils:InterceptorUtils;

    constructor(
        private logger: NGXLogger,
        private angularSecurity: AngularSecurity,
        private angularSecurityRSA: AngularSecurityRSAService
    ) {
        this.intercepUtils = new InterceptorUtils();
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    let bodyOriginal;
                    let encodingLanguage;

                    if (evt.body !== null) {
                        bodyOriginal = evt.body.response;
                        encodingLanguage = JSON.parse(this.angularSecurityRSA.decryptRSA(req.headers.get('encoding-language')));
                    }

                    //se desencripta el body original siempre y cuando se cumplan con los siguientes codigos de respuesta
                    //todo llamado de endpoint pasa por este interceptor del response
                    if (this.responseOK.includes(evt.status) && encodingLanguage != null && bodyOriginal != undefined) {
                        let llave: any = encodingLanguage.rnd;
                        let bodyDecrypt: any = JSON.parse(this.angularSecurity.decryptAES2(bodyOriginal, llave));
                        evt.body.response = bodyDecrypt;
                    }
                    
                    this.logger.info("RECEIVE BACKEND", "time", this.intercepUtils.getTime());
                }
            }));
    }    
}