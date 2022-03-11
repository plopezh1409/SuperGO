import { ChangeDetectorRef, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBreadcrumbService } from 'mat-breadcrumb';
import { AppComponent } from '@app/app.component';
import Swal from 'sweetalert2';
import { finalize, pluck } from 'rxjs/operators';
import { isObservable } from 'rxjs';
import { User } from '@app/core/models/public/user.model';

//SERVICES
import { AuthService } from '../../services/sesion/auth.service';
import { MasterKeyService } from '../../services/sesion/masterKey.service';
import { ResponseServer } from '../../models/public/responseServer.model';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogTop } from '@app/core/layout/dialog/dialogTop/dialogTop.component';
import { UsuarioService } from '@app/core/services/public/usuario.service';
import { element } from 'protractor';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})
export class InicioComponent implements OnInit {
  private authService: AuthService;

  private userService: UsuarioService;
  private llaveMaestraService: MasterKeyService;
  inputSearch: string = '';
  showImage = true;
  init: boolean = false;
  cardsTop: any[] = [];
  cardsTopRes: any[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public tk: string | null;
  usuario: User;
  Auth = false;
  constructor(
    private cdref: ChangeDetectorRef,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.authService = this.injector.get<AuthService>(AuthService);
    this.llaveMaestraService = this.injector.get<MasterKeyService>(MasterKeyService);
    this.userService = this.injector.get<UsuarioService>(UsuarioService);
    this.appComponent.showInpImage(true);
    this.appComponent.showBoolImg(true);
    this.appComponent.showLogo = false;
    this.tk = this.activatedRoute.snapshot.paramMap.get('token');
    this.usuario = new User();
    this.Auth = this.authService.isAuthenticated();
  }
 
  ngOnInit(): void {
  //  debugger;
    //--------REDIRECTION --- GO -> SUPERGO-------------
    if (this.tk) {
      if (this.authService.isAuthenticated()) {
        Swal.fire({
          html: `<div class="titModal">Aviso</div><br/><span class="material-icons error-icon">error</span><br/><div>${this.authService.usuario.name} ya estás autenticado!</div>`,
          allowOutsideClick: false,
          confirmButtonText: 'Aceptar',
          heightAuto: false
        });
        this.router.navigate(['/']);
      } else {
        this.Auth = false;
        this.init = false;
        this.authService.guardarToken(this.tk);
        this.authService.guardarUsuario(this.tk);
        this.initLoginWithToken(this.authService.usuario);
      }
    }
    //--------------------------------------------------
    else {
      this.Auth = false;
      this.init = false;
      let actMk = this.authService.isActiveMasterKey;
      if (isObservable(actMk)) {
        this.appComponent.showLoader(true);
        actMk.pipe(finalize(() => this.appComponent.showLoader(false))).subscribe(result => {
          this.initLogin(result);
        });
      }
      else {
        this.initLogin(actMk);
      }
    }

  }

  initLogin(activarLLaveMaestra: boolean) {
    if (this.authService.isAuthenticated()) {
      this.getFavoriteTop();
    }
    else if (activarLLaveMaestra) {
      this.isActiveMasterKey();
    } else {
      this.router.navigate(['/login']);
    }
    this.init = true;
  }
  initLoginWithToken(usuario: User) {
    setTimeout(() => {
      this.appComponent.isAuth = true;
    //this.Auth = true;
    this.openSnackBar(`Bienvenido ${this.capitalize(usuario.name)}`, 'Cerrar', 'successToast')
    this.getFavoriteTop();
    this.init = true;
    }, 100);
    
  }
  isActiveMasterKey() {
    let llaveMaestraObject = {
      code: this.activatedRoute.snapshot.queryParamMap.get('code'),
      scope: this.activatedRoute.snapshot.queryParamMap.get('scope')
    };

    if (llaveMaestraObject.code) {
      this.appComponent.showLoader(true);
      this.llaveMaestraService.getUserInfo(llaveMaestraObject.code)
        .pipe(finalize(() => this.appComponent.showLoader(false)))
        .subscribe((response: ResponseServer) => {
          if (response.code === 200) {
            this.getUserMasterKey(response.response);
          } else if (response.code === 227) {
            this.isActiveSession(response.response);
          }
        }, (error: any) => {
          this.errorMasterKey(error);
        });
    }
    else {
      this.appComponent.showLoader(false);
      this.router.navigate(['/login']);
    }
  }

  getUserMasterKey(data: any) {
    this.authService.guardarToken(data);
    this.authService.guardarUsuario(data);
    let usuario = this.authService.usuario;

    if (Number(usuario.employee) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Inicio de sesión',
        text: `No se ha Identificado al usuario correctamente,  falta número de empleado `,
        heightAuto: false,
        allowOutsideClick: false
      });
      this.router.navigate(['/login']);
    }
    else {
      this.openSnackBar(`Bienvenido ${usuario.name}`, 'Cerrar', 'successToast');
      this.router.navigate(['/']);
      this.appComponent.isAuth = true;
      this.getFavoriteTop();
    }
  }

  isActiveSession(data: any) {
    this.appComponent.showLoader(true);
    Swal.fire({
      icon: 'warning',
      title: 'Ya tienes una sesión activa!',
      text: `Tu sesión esta abierta en otra computadora o navegador. Haz click en "USAR AQUÍ" para usar tu sesión en esta ventana`,
      showDenyButton: true,
      confirmButtonText: `Usar aquí`,
      denyButtonText: `Cerrar sesión`,
      heightAuto: false,
      allowOutsideClick: false
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.authService.newSession(data).subscribe(dt => {
          this.appComponent.isAuth = true;
          this.getFavoriteTop();
        });
      } else if (result.isDenied) {    //CERRAR SESIÓN
        this.authService.logout().subscribe(() => {
          this.router.navigate(['/login']);
        });
      }else {
      }

      this.appComponent.showLoader(false);
      this.router.navigate(['/login']);
    });
  }

  openSnackBar(message: any, action: any, type: any) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
      duration: 3000
    });
  }

  redirect(topModule: any) {
    let module = this.authService.getModuleByUrl(topModule.url);
    if (module) {
      this.authService.getRoleName(module.role.name);
      this.router.navigateByUrl(topModule.url);
    }
  }

  errorMasterKey(error: any) {
    Swal.fire({
      title: 'Error',
      text: error.error.mensajeRespuesta === undefined ? error.message : error.error.message,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((res) => {
      if (res.isConfirmed) {
        this.llaveMaestraService.rp = this.llaveMaestraService.redirect_uri;
        window.location.href = this.llaveMaestraService.logout();
      }
    });
  }

  calculateAdd() {
    this.cardsTopRes = [];
    let can = this.cardsTop.length;
    for (let i = 0; i < 5 - can; i++) {
      this.cardsTopRes.push(i);

    }
  }

  addTarget() {
    const dialogRef = this.dialog.open(DialogTop, {
      width: '320px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        title: 'Agregar Nuevo Favorito',
        modules: this.authService.usuario.modules,
        top: this.authService.usuario.top,
        cantidad: this.cardsTop.length
      }
    });
    dialogRef.afterClosed()
      .pipe(finalize(() => { this.appComponent.showLoader(false); }))
      .subscribe((result: any) => {
        if (result) {
          if (result.success) {
            this.cardsTop = [];
            result.data.forEach((element: any) => { this.cardsTop.push(element); });
            this.authService.usuario.top = this.cardsTop;
            this.authService.upgradeUser(this.authService.usuario);
            this.calculateAdd();
          } else {
            this.openSnackBar(`Error al Agregar Favorito`, 'Cerrar', 'errorToast');
          }
        }
      });

  }

  deleteTarget(index: any) {
    Swal.fire({
      title: '¿Estas seguro de eliminar este favorito?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        let tp = {
          'idTop': this.cardsTop[index].id
        }
        this.appComponent.showLoader(true);
        this.userService.modifyTop(tp, 'delete')
          .pipe(pluck('response'), finalize(() => { this.appComponent.showLoader(false); }))
          .subscribe(() => {
            this.cardsTop.splice(index, 1);
            this.authService.usuario.top = this.cardsTop;
            this.authService.upgradeUser(this.authService.usuario);
            this.openSnackBar(`Favorito Eliminado Correctamente`, 'Cerrar', 'successToast');
            this.calculateAdd();
          });
      }
    })
  }

  getFavoriteTop() {
    if (this.authService.usuario.top) {
      this.cardsTop = this.authService.usuario.top;
    }

    this.calculateAdd();
  }
  capitalize(val: string) {
    if (val.length > 0) {
      return val.toLowerCase().trim().split(' ').map((v: string) => v[0].toUpperCase() + v.substr(1)).join(' ');
    }
    return null;
  }
}
