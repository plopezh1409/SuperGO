import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import swal, { SweetAlertIcon } from 'sweetalert2';

//COMPONENTS
import { AppComponent } from '@app/app.component';

//MODELS
import { Rol } from '../../core/models/public/rol.model';
import { User } from '@app/core/models/public/user.model';
import { LoginObject } from '../../core/models/sesion/login-object.model';

//SERVICES
import { UsuarioService } from '../../core/services/public/usuario.service';
import { AuthService } from '../../core/services/sesion/auth.service';
import { MasterKeyService } from '../../core/services/sesion/masterKey.service';
import { isObservable } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { ServiceNoMagicNumber, ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private authService: AuthService;
  private UsuarioService: UsuarioService;
  private llaveMaestraService: MasterKeyService;
  private iconError: SweetAlertIcon = 'error';
  private titleMessage = 'Lo sentimos';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loginForm: FormGroup;
  actualizaForm: FormGroup;
  submitted = false;
  firstStart = false;
  error: { code: number, message: string };
  usuario: User;
  rol: Rol;
  usuarioAux: string | null;
  activateMasterKey = false;
  p4ss1: string | null;
  p4ss2: string;
  p4ss3: string;
  p4ssCopy: string;  
  codesResult: string;
  regex: string;

  constructor(    
    private injector: Injector,
    private router: Router,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute,
    private appComponent: AppComponent,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.authService = this.injector.get<AuthService>(AuthService);
    this.UsuarioService = this.injector.get<UsuarioService>(UsuarioService);
    this.llaveMaestraService = this.injector.get<MasterKeyService>(MasterKeyService);
    this.usuario = new User();
    this.rol = new Rol();
    this.loginForm = new FormGroup({});
    this.actualizaForm = new FormGroup({});
    this.error = { code: 0, message: '' };
    this.usuarioAux = null;
    this.p4ss1 = null;
    this.p4ss2 = '';
    this.p4ss3 = '';
    this.p4ssCopy = '';
    this.codesResult = '';
    this.regex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{10,}$';
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {   
      swal.fire({
        html: `<div class='titModal'>Aviso</div>
        <br/>
        <span class='material-icons error-icon'>
          error
        </span>
        <br/>
        <div>
        ${this.authService.usuario.name} ya est??s autenticado!
        </div>
        `,
        allowOutsideClick: false,
        confirmButtonText: 'Aceptar',
        heightAuto: false
      });
      this.router.navigate(['/']);
    }
    else if (this.rutaActiva.snapshot.params.ADMIN != null
      && !isNaN(this.rutaActiva.snapshot.params.ADMIN)
      && Number(this.rutaActiva.snapshot.params.ADMIN) >= 0) {
      this.usuarioAux = this.rutaActiva.snapshot.params.ADMIN;
    }
    else {
      const actMk = this.authService.isActiveMasterKey;
      if (isObservable(actMk)) {
        this.appComponent.showLoader(true);
        actMk.pipe(finalize(() => this.appComponent.showLoader(false))).subscribe(result => {
          this.activateMasterKey = result;
        });
      }
      else {
        this.activateMasterKey = actMk;
      }
    }

    this.loginForm = this.formBuilder.group({
      employee: [null, Validators.required],
      p4ss: [null, Validators.required],
      user: [null],

    });
    this.actualizaForm = this.formBuilder.group({
      p4ss1: [null, Validators.required],
      p4ss2: [null, Validators.required],
      p4ss3: [null, Validators.required],

    });
  }

  onSubmit() {
    this.validateAllFormFields(this.loginForm);
  }
  
  getUsuarioAux() {
    if (this.rutaActiva.snapshot.params.ADMIN != null
      && !isNaN(this.rutaActiva.snapshot.params.ADMIN)
      && Number(this.rutaActiva.snapshot.params.ADMIN) >= 0) {
      this.usuarioAux = this.rutaActiva.snapshot.params.ADMIN;
      return this.usuarioAux;
    }
    return this.usuarioAux;
  }

  validateActiveSession(data: any) {    
    swal.fire({
      icon: 'warning',
      title: 'Ya tienes una sesi??n activa!',
      text: `Tu sesi??n esta abierta en otra computadora o navegador. Haz click en "USAR AQU??" para usar tu sesi??n en esta ventana`,
      showDenyButton: true,
      confirmButtonText: `Usar aqu??`,
      denyButtonText: `Cerrar sesi??n`,
      heightAuto: false
    }).then((result) => {
      //RENOlet TOKEN
      if (result.isConfirmed) {
        this.appComponent.showLoader(true);
        this.authService.newSession(data).pipe(finalize(()=>{this.appComponent.showLoader(false);}))
        .subscribe(dt=> {
          this.logIn(this.authService.usuario);    
        });
      } else if (result.isDenied) {    //CERRAR SESI??N
        this.authService.limpiarSesion();
        this.router.navigate(['/login']);
      }else {
      }
    });
  }


  login(): void {
    this.submitted = true;
    if (this.emptyFields()) {
      return;
    }

    //Convirtiendo a base 64    
    this.p4ssCopy = this.usuario.p4ss;
    this.usuario.p4ss = btoa(this.usuario.p4ss);
    const obj = new LoginObject((this.usuario));
    obj.user = this.rutaActiva.snapshot.params.ADMIN != null
      && !isNaN(this.rutaActiva.snapshot.params.ADMIN)
      && Number(this.rutaActiva.snapshot.params.ADMIN) >= 0 ? this.rutaActiva.snapshot.params.ADMIN : '0';
    this.appComponent.logger.info('LOGIN PROCESS, ', obj);
    this.appComponent.showLoader(true);
    this.authService.login(obj)
      .pipe(finalize(() => { this.appComponent.showLoader(false); }))
      .subscribe(response => {
        this.appComponent.logger.info('LOGIN response', response);
        switch (response.code) {
          case this.codeResponse.RESPONSE_CODE_200://LOGUEO EXITOSO
            this.authService.guardarUsuario(response.response);
            this.authService.guardarToken(response.response);            
            this.logIn(this.authService.usuario);            
            break;
          case this.codeResponse.RESPONSE_CODE_207://NECESITA CAMBIO DE PASSWORD
            this.firstStart = true;
            this.codesResult = response.message;
            break;
          case this.codeResponse.RESPONSE_CODE_227://SE IDENTIFICO SESION ACTIVA EN OTRO LUGAR
            this.validateActiveSession(response.response);
            break;
          default: break;
        }
      }, err => {
        this.appComponent.logger.info('LOGIN error:', err);
        if (err.status === this.codeResponse.RESPONSE_CODE_400) {
          swal.fire({
            icon: this.iconError,
            title: this.titleMessage,
            text: 'Usuario o contrase??a incorrecta!',
            heightAuto: false
          });
        }       
      });
  }

  actualizarP4ss() {
    this.validateAllFormFields(this.actualizaForm);
    const p4ssA = atob(this.usuario.p4ss);
    const regex = new RegExp(this.regex);
    if (this.p4ss1 === null || this.p4ss1 === undefined || this.p4ss1 === '') {
      this.sweet(this.iconError, this.titleMessage, 'Ingresa tu contrase??a actual', false);
    }
    else if (this.p4ss1 !== p4ssA) {
      this.sweet(this.iconError, this.titleMessage, 'Tu contrase??a es incorrecta', false);
    }
    else if (this.p4ss2 === null || this.p4ss2 === '') {
      this.sweet(this.iconError, this.titleMessage, 'Ingresa tu contrase??a nueva', false);
    }
    else if (this.p4ss2.length < this.codeResponseMagic.RESPONSE_CODE_10 || this.p4ss2.length > this.codeResponseMagic.RESPONSE_CODE_10) {
      this.sweet(this.iconError, this.titleMessage, 'La contrase??a debe ser de 10 caracteres', false);
    }
    else if (this.p4ss2 === p4ssA) {
      this.sweet(this.iconError, this.titleMessage, 'Tu nueva contrase??a debe ser diferente a la anterior', false);
    }
    else if (!regex.test(this.p4ss2)) {
      this.sweet(this.iconError, this.titleMessage, 'La contrase??a no es valida, debes tener almenos 1 mayuscula, 1 minuscula y un caracter especial (#?!@$%^&*-_)', false);
    }
    else if (this.p4ss3 === null || this.p4ss3 === '') {
      this.sweet(this.iconError, this.titleMessage, 'Ingresa de nuevo tu contrase??a', false);
    }
    else if (this.p4ss2 !== this.p4ss3) {
      this.sweet(this.iconError, this.titleMessage, 'No coincide con la contrase??a anterior', false);
    } else {
      swal.fire({
        title: '??ltimo paso!',
        text: '??Seguro que deseas actualizar la contrase??a?',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        heightAuto: false,
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.appComponent.showLoader(true);
          this.authService.updatePassword({
            employee: this.usuario.employee,
            origen: this.usuario.p4ss,
            newPsswrd: btoa(this.p4ss3)
          })
            .pipe(finalize(() => this.appComponent.showLoader(false)))
            .subscribe(
              response => {
                this.authService.guardarUsuario(response.response);
                this.authService.guardarToken(response.response);
                const usuario = this.authService.usuario;
                this.logIn(usuario);
              },
              err => {
                this.appComponent.logger.error('actualizarP4ss error', err.error.errors);
                swal.fire('Hubo un problema', `${err.error.message} ,intente de nuevo`,this.iconError );
                swal.fire({
                  icon: this.iconError,
                  title: this.titleMessage,
                  text: `${err.error.message} ,intente de nuevo`,
                  heightAuto: false
                });
                this.authService.logout().subscribe(() => {
                  location.reload();
                  this.appComponent.isAuth = false;
                });
              }
            );
        } else {
          this.authService.logout().subscribe(() => {
            location.reload();
            this.appComponent.isAuth = false;
          });
        }
      });

    }

  }

  sweet(icons: SweetAlertIcon, title: string, text: string, heightAuto: boolean) {
    swal.fire({
      icon: icons,
      title,
      text,
      heightAuto
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
      else{

      }
    });
  }

  emptyFields(): boolean {
    if (this.usuario.employee === null || this.usuario.employee === '') {
      swal.fire({
        icon: this.iconError,
        title: this.titleMessage,
        text: 'Debe ingresar su n??mero de empleado',
        heightAuto: false
      });
      return true;
    } else if (this.usuario.p4ss === null || this.usuario.p4ss === '') {
      swal.fire({
        icon: this.iconError,
        title: this.titleMessage,
        text: 'Debe ingresar su contrase??a',
        heightAuto: false
      });
      return true;
    } else {
      return false;
    }
  }

  get usuarioError() {
    return this.loginForm.get('employee');
  }

  get p4ssUserError() {
    return this.loginForm.get('p4ss');
  }

  get recaptchaError() {
    return this.loginForm.get('recaptcha');
  }

  get p4ssUserError1() {
    return this.actualizaForm.get('p4ss1');
  }
  get p4ssUserError2() {
    return this.actualizaForm.get('p4ss2');
  }
  get p4ssUserError3() {
    return this.actualizaForm.get('p4ss3');
  }

  reload() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this.ngOnInit();
    });
  }

  logIn(usuario: User) {
    this.appComponent.isAuth = true;
    this.openSnackBar(`Bienvenido ${this.capitalize(usuario.name)}`, 'Cerrar', 'successToast');
    this.router.navigate(['/inicio']);
  }

  masterKey(): void {
    const llaveMaestraObject = {
      code: this.activatedRoute.snapshot.queryParamMap.get('code'),
      scope: this.activatedRoute.snapshot.queryParamMap.get('scope')
    };

    if (llaveMaestraObject.code) {
      this.router.navigate(['/']);
    }
    else {
      setTimeout(() => {
        window.location.href = this.llaveMaestraService.getUrlAuthz();
      }, Number(this.codeResponseMagic.RESPONSE_CODE_1500));
    }
  }
  
  openSnackBar(message: string, action: string, type: any) {

    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
      duration:3000

    });
  }
  capitalize(val: string) {
    if(val.length>0)
    {
      return val.toLowerCase().trim().split(' ').map((v: string) => v[0].toUpperCase() + v.substr(1)).join(' ');
    }
    return null;    
  }
}

