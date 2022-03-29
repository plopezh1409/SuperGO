import { Component, HostListener, OnInit, Injector, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { AuthService } from './core/services/sesion/auth.service';
import swal from 'sweetalert2';
import { MatBreadcrumbService } from 'mat-breadcrumb';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ServiceNoMagicNumber } from './core/models/ServiceResponseCodes/service-response-codes.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
@Injectable({
  providedIn: 'root'
})
export class AppComponent implements OnInit {
  private readonly codeResponse: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  title = 'SuperGO';
  public showLoad = false;
  public showLogo = false;
  private loaderDuration: number;
  isAuth = false;
  public mostrarCarga: boolean;
  userActicity: any;
  userActivityPerMinute: any;
  userActivityToast:any;
  userInactive: Subject<void> = new Subject();
  userInactivePerMinute: Subject<void> = new Subject();
  warningExpiredSessionTime: Subject<void> = new Subject();
  private matBreadcrumbService: MatBreadcrumbService;
  public inpImage = true;
  public boolImg = true;
  public initIN = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    public injector: Injector,
    public logger: NGXLogger,
    private _snackBar: MatSnackBar) 
    {
    this.mostrarCarga = false;
    this.loaderDuration = 100;
    this.isAuth = this.authService.isAuthenticated();
    this.setTimeout();    
    this.warningExpired();

    this.userInactive.subscribe(() => {
      if (this.authService.isAuthenticated()) 
      {
        this.authService.logout().subscribe(() => {
          this.authService.terminarSesion('/login', '¡Necesitas iniciar sesión nuevamente!');          
          this.isAuth = false;
        });
      }
    });

    this.userInactivePerMinute.subscribe(() => {
      if(this.isValidSession())
      {
        swal.fire({
          icon: 'warning',
          title: 'La sesión se cerrará pronto por inactividad',
          text: 'Le queda un 1 minuto!',
          heightAuto: false
        });
      }      
    });

    this.warningExpiredSessionTime.subscribe(()=>{      
      if(this.isValidSession())
      {
        this.openSnackBar(`¡Tu sesión se cerrará en 5 minutos!`, 'Cerrar', 'warningToast');
      }
    });

    this.matBreadcrumbService = this.injector.get<MatBreadcrumbService>(MatBreadcrumbService);
  }

  isValidSession():boolean
  {
    let isValid = true;
    if (!this.authService.isAuthenticated() || this.authService.isTokenExpirado())
    {
      this.authService.terminarSesion('/','¡Necesitas iniciar sesión nuevamente!');
      isValid = false;
    }    

    return isValid;
  }

  ngOnInit(): void {
    this.showLoad = false;
    this.showLogo = false;
    this.inpImage = true;

  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

  setTimeout() {
    this.userActicity = setTimeout(() => this.userInactive.next(), 
    Number(this.codeResponse.RESPONSE_CODE_600000)); //TIEMPO DE 10 MINUTOS DE INACTIVIDAD CIERRE DE SESIÓN
    this.userActivityPerMinute = setTimeout(() => 
    this.userInactivePerMinute.next(), 
    Number(this.codeResponse.RESPONSE_CODE_540000)); //TIEMPO DE 9 MINUTOS DE INACTIVIDAD MENSAJE DE AVISO        
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActicity);
    clearTimeout(this.userActivityPerMinute);
    this.setTimeout();
  }

  showInpImage(inpImage: boolean): void {
    this.inpImage = inpImage;
  }
  showBoolImg(boolImg: boolean): void {
    this.boolImg = boolImg;
  }
  clearSearch(initIN: boolean): void {
    this.initIN = initIN;
  }
  openSnackBar(message: any, action: any, type: any) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
      duration: 3000
    });
  }

  warningExpired()
  {
    if(this.authService.sessionTime>0)
    {
      const timeToast = this.authService.sessionTime - Number(this.codeResponse.RESPONSE_CODE_300);// HORA DE LA SESSION MENOS 5 MINUTOS
      const now = (new Date().getTime() / Number(this.codeResponse.RESPONSE_CODE_1000)); //HORA LOCAL ACTUAL     
      if(timeToast > now)
      {
        this.userActivityToast = setTimeout(()=> this.warningExpiredSessionTime.next(), ((timeToast - now) * Number(this.codeResponse.RESPONSE_CODE_1000)));
      }      
    } 
  }
}
