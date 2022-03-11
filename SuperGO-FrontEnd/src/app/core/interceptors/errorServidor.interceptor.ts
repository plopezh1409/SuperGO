import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { InterceptorUtils } from '../models/public/interceptorUtils.model';
import { AuthService } from '../services/sesion/auth.service';

@Injectable()
export class ErrorServidorInterceptor implements HttpInterceptor {
  errorMessage = '';
  private intercepUtils:InterceptorUtils;
  constructor(
    private logger: NGXLogger,    
    private authService: AuthService,
    private router: Router,        
  ) {
    this.intercepUtils = new InterceptorUtils();
  }

  palabrasNoPermitidasImprimir = ['http', 'com', 'mx', 'wwww', 'https']

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(      
      catchError((exception: HttpErrorResponse) => {        
        this.logger.info('errorServidor.intercept BACKEND', exception,' time ',this.intercepUtils.getTime());
        switch (exception.status) {
          case 0:
            this.logger.error('Error 0',exception);
            this.errorMessage = 'Sin conexión a Internet';
            break;
          case 400:
            this.logger.error('Error 400',exception);
            this.errorMessage = exception.error?.message !== undefined? exception.error?.message:'Solicitud Inválida';
            break;
          case 401:  
          case 403:
            this.errorMessage = `¡No tienes acceso a este recurso o tu sesión fue cerrada!`;
            this.authService.limpiarSesion();          
            this.authService.IsCloseSystem();
            this.router.navigate(['/inicio']);
            break;
          case 404:
            //MENSAJE DESDE BACKEND
            this.logger.error('Error 404',exception);
            this.errorMessage = exception.error?.message !== undefined? exception.error?.message:'Recurso no encontrado';
            break;
          case 500:                      
            this.logger.error('Error 500',exception);
            this.errorMessage = 'Error interno del servidor, contacte a soporte del gestor de operaciones';
            break;
          default:
            this.logger.error('Error ' + exception.status, exception);
            this.errorMessage = exception.message;
        }

        Swal.fire({
          html: `<div class="titModal">Aviso</div><br/>
          <span class="material-icons error-icon">error</span><br/>
          <div>${this.errorMessage}</div>`,
          allowOutsideClick: false,
          heightAuto: false,
          confirmButtonText: 'Aceptar',
        }); 

        return throwError(exception);
      })
    );
  }
}
