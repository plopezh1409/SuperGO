import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2'
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
  

  constructor(
    private authService: AuthService,    
    private router: Router,
    private logger: NGXLogger    
  ) {    
   
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean { 
      return true;
  }
}