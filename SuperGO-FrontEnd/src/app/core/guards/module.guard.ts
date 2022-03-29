import { Injectable } from '@angular/core';
import { Router, UrlTree, Route, UrlSegment, CanLoad } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import swal from 'sweetalert2';

//SERVCIOS
import { AuthService } from '../services/sesion/auth.service';


@Injectable({
    providedIn: 'root'
})
export class ModuleGuard implements CanLoad {   
    
  constructor(private authService: AuthService, 
              private router: Router,
              private logger: NGXLogger){ }

    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      
        if(this.authService.isAuthenticated()){
          if(!this.authService.isTokenExpirado()){
            return this.isUserModuleValid(this.getFullpath(segments));
          }else{            
            //En el metodo canLoad se puede regresar un Observable<bool>(lo ejecuta en automatico) o un tipo booleano          
            return this.authService.tokenRefresh(this.authService.token)
            .pipe(pluck('response'), map(data=> {                      
              if (data !== null && data.length > 0){
                this.authService.guardarToken(data);  
                this.authService.guardarUsuario(data);  
                return this.isUserModuleValid(this.getFullpath(segments));
              }else{
                this.logger.info('Terminar Sesion canLoad observable');
                this.authService.terminarSesion('/login', '¡Necesitas iniciar sesión!');  
                return false;
              }}));
          }         
        }else{
          this.logger.info('Terminar Sesion canLoad');
          this.authService.terminarSesion('/login', '¡Necesitas iniciar sesión!');               
          return false;    
        }
      }

      isUserModuleValid(fullPath:string):boolean
      { 
        const module = this.authService.getModuleByUrl(fullPath);
        if(module)
        {
          this.authService.getRoleName(module.role.name);
          return true;
        }

        return false;        
      }


      getFullpath(segments: UrlSegment[]) {
        let fullPath:string='';
        if(segments.length>0){
          fullPath = segments.reduce((path, currentSegment) => {
            return `${path}/${currentSegment.path}`;
          }, '');          
        }
        return fullPath;
      }
}