import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//SERVICIOS
import { AngularSecurityRSAService } from '@app/core/services/public/angularSecurityRSA.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AngularSecurity } from '../services/public/angularSecurity.service';
import { AuthService } from '../services/sesion/auth.service';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { InterceptorUtils } from '../models/public/interceptorUtils.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    token: any;
    bodyClone: any;
    encodingLanguage: any;
    deviceInfo: any = null;
    url: string = '';
    context: string = '';
    private intercepUtils:InterceptorUtils;

    constructor(
        private authService: AuthService,
        private router: Router,        
        private angularSecurity: AngularSecurity,
        private angularSecurityRSA: AngularSecurityRSAService,
        private logger: NGXLogger       
    ) { 
        this.deviceInfo = this.authService.deviceService.getDeviceInfo();
        this.bodyClone = '';
        this.encodingLanguage = '';
        this.intercepUtils = new InterceptorUtils();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        //Nota: El authService es el puente para validar si tiene token valido
        //se requiere tomar el token de authService ya que la variable token de este 
        //interceptor no se actualizaba correctamente cuando se cambiaba de usuario      
        this.token = this.authService.token;    
        this.url = req.url;
        const bodyOriginal: any = req.body;
        let authReq: any = req.body;
        
        switch (true) {
            case (this.token != null && bodyOriginal != null && !this.revisarListaNegra()):
                this.generarEncoding(bodyOriginal);

                authReq = req.clone({
                    headers: req.headers
                        .set('Authorization', 'Bearer ' + this.token)
                        .set('Encoding-Language', this.encodingLanguage),
                    body: this.bodyClone,
                    url: this.url
                });
                break;

            case (this.token === null && bodyOriginal != null && !this.revisarListaNegra()):
                this.generarEncoding(bodyOriginal);

                authReq = req.clone({
                    headers: req.headers
                        .set('Encoding-Language', this.encodingLanguage),
                    body: this.bodyClone,
                    url: this.url
                });
                break;

            case (this.token != null && this.revisarListaNegra()):

                authReq = req.clone({ 
                    headers: req.headers
                        .set('Authorization', 'Bearer ' + this.token),
                        url: this.url
                });
                break;

            case (this.token != null && bodyOriginal === null):
                authReq = req.clone({ 
                    headers: req.headers
                        .set('Authorization', 'Bearer ' + this.token),
                        url: this.url
                });
                break;
            default:
                authReq = req.clone({
                    headers: req.headers,
                        url: this.url
                });
                break;
        }      
        this.logger.info('SEND BACKEND' , 'time', this.intercepUtils.getTime());
        return next.handle(authReq);
    }

    generarEncoding(bodyOriginal: any): void {
        const objEncrypt = this.angularSecurity.encryptAES2(typeof (bodyOriginal) != 'string' ? JSON.stringify(bodyOriginal) : bodyOriginal);
        this.bodyClone = {
            'text': objEncrypt.texto
        };
        const json: any = {
            'rnd': objEncrypt.llave,
            'device': this.deviceInfo.deviceType,
            'browser': this.deviceInfo.browser
        };
        this.encodingLanguage = this.angularSecurityRSA.encryptRSA(JSON.stringify(json));
    }

    revisarListaNegra(): boolean {
        const listaNegra: string[] = ['evidence/save', 'evidence', 'validation/csv'];
        let flag = false;

        listaNegra.forEach(element => {
            if (this.url.includes(element)) {
                flag = true;
            }
        });
        return flag;
    } 
}
