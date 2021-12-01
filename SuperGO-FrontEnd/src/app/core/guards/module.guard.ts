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
      return true;
      }

      isUserModuleValid(fullPath:string):boolean
      { 
        return true;       
      }


      
}