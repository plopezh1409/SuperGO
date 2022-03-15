import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

//SERVICIOS
import { AuthService } from '../services/sesion/auth.service';

//MODELOS
import { User } from '../models/public/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  usuario: User;
  token:string|null;
  payload: any;
  payloadAjustado;

  constructor(
    private authService: AuthService,    
    private router: Router,
    private logger: NGXLogger    
  ) {    
    this.usuario = new User();

    this.token = authService.token;
    this.payload = null;
    this.payloadAjustado = 0;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {            
      if (this.authService.isAuthenticated()) {        
        if(!this.authService.isTokenExpirado())
        {          
          return true;
        }
        else
        {            
          //En el metodo canActivate se puede regresar un Observable<bool>(lo ejecuta en automatico) o un tipo booleano          
          return this.authService.tokenRefresh(this.authService.token)
          .pipe(pluck('response'), map(data=> {                      
            if (data !== null && data.length > 0)
            {
              this.authService.guardarToken(data);  
              this.authService.guardarUsuario(data);  
              return true;
            }
            else
            {
              this.logger.info('Terminar Sesion canActivate observable');
              this.authService.terminarSesion('/login', '¡Necesitas iniciar sesión!');  
              return false;
            }}));
        }        
      }
      else
      {
        this.logger.info('Terminar Sesion canActivate');
        this.authService.terminarSesion('/login', '¡Necesitas iniciar sesión!');               
        return false;    
      }
  }
}