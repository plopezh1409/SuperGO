import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


//SERVICIOS
import { DeviceDetectorService } from 'ngx-device-detector';

//MODELOS
import { User } from '../../models/public/user.model';

//ENVIROMENT
import { Page } from '@app/core/models/public/page.module';
import { UserService } from '../public/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _usuario: any;
    private _token: any;
    private _rol: any;
    private _module: any;
    private storage: any;
    private _payload: any;
    private _payloadAjustado: number;
    private _urlEnviroment: string | null;
    private activateMasterKey: boolean | null;
    deviceInfo: any = null;
    private _roleName: BehaviorSubject<string>;
    private _isClosed: BehaviorSubject<any>;
    roleName: Observable<any>;
    isClosed: Observable<any>;
    private minuteAjustTime = 120;

    constructor(
        public injector: Injector,
        private http: HttpClient,
        public deviceService: DeviceDetectorService,
        private router: Router,
        private logger: NGXLogger,
        public User: UserService
    ) {
        this._usuario = null;
        this._payload = null;
        this._payloadAjustado = 0;

        this._token = null;
        this._urlEnviroment = null;
        this.activateMasterKey = null;
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this._roleName = new BehaviorSubject('null');
        this.roleName = this._roleName.asObservable();
        this._isClosed = new BehaviorSubject('');
        this.isClosed = this._isClosed.asObservable();
    }

    public get usuario(): User {
        if (this._usuario != null) {
            return this._usuario;
        } else if (this._usuario == null) {
            this._usuario = '';
            return this._usuario;
        }
        return new User();
    }


    public set selectedModule(module: any) {
    }

    public get selectedModule(): any {
        if (this._module != null) {
            return this._module;
        } else if (this._module == null) {
            this._module = '';
            return this._module;
        }
        return {} as Page;
    }

    public get payload(): any {
        if (this._payload != null) {
            return this._payload;
        }
        else if (this._token != null) {

        }
        return null;

    }

    public get urlEnviroment() {
        if (this._urlEnviroment != null) {
            return this._urlEnviroment;
        }
        else {
            let urlCle = '';
            this._urlEnviroment = '';
            return this._urlEnviroment;
        }
    }

    public get sessionTime() {
        if (this.payload) {
            this._payloadAjustado = ((this.payload.exp) - this.minuteAjustTime) || 0;
        }

        return this._payloadAjustado;
    }

    isAuthenticated(): boolean {

        return true;

    }

    limpiarSesion() {
        this._token = null!;
        this._usuario = null!;
        this._payloadAjustado = 0;
        this._payload = null;
        localStorage.clear();
    }

    isTokenExpirado() {
        // HORA DE EXPIRACIÓN DEL TOKEN        
        this._payloadAjustado = ((this.payload.exp) - this.minuteAjustTime) || 0; // -> SE RESTAN 2 MINUTOS PARA RENOVAR ANTES DE QUE SE ACABE EL TIEMPO REAL DEL TOKEN                
        let now = (new Date().getTime() / 1000); //HORA LOCAL ACTUAL
        this.logger.info("AuthService isTokenExpirado, TiempoExp:", new Date(this.payload.exp * 1000), "TiempoAjust", new Date(this._payloadAjustado * 1000), "TiempoActual", new Date(now * 1000));

        if (this._payloadAjustado < now) {
            return true;
        }
        return false;
    }

    terminarSesion(ruta: string, mensaje: string) {
        this.limpiarSesion();
        this.router.navigate([ruta]);
        
        swal.fire({
            html: `<div class="titModal">Aviso</div><br/>
            <span class="material-icons error-icon">error</span><br/>
            <div>${mensaje}</div>`,
            allowOutsideClick: false,
            heightAuto: false,
            confirmButtonText: 'Aceptar',
        });
    }



    logout() {
        this.limpiarSesion();
    }
    login(loginObj: any): Observable<any> {
        return this.User.getResponse();
    }

    getModuleByUrl(url: string) {
        let filterUrlModule: any[] = [];
        const { modules } = this.usuario;
        if (!modules) {
            swal.fire({
                icon: 'warning',
                title: 'Accesso denegado',
                text: 'No tienes permisos asignados',
                heightAuto: false
            });
            return null;
        }

        modules.forEach(page => {
            const { operation } = page.module;
            if (operation) {
                let filter = operation.filter(op => url.includes(op.url) && op.url.trim().length > 0);
                if (filter.length > 0) {
                    filterUrlModule = filterUrlModule.concat(page);
                }
            }
        });

        if (filterUrlModule.length <= 0) {
            filterUrlModule = [];
            filterUrlModule = modules.filter(page => url === page.module.url);
            console.log("URL", url);
            console.log("PAGE", filterUrlModule);

            if (filterUrlModule.length <= 0) {
                swal.fire({
                    icon: 'warning',
                    title: 'Accesso denegado',
                    text: 'No  tienes permisos a este recurso',
                    heightAuto: false
                });
                this.router.navigate(['/']);
                return null;
            }
        }

        filterUrlModule = this.sortModule(filterUrlModule);
        return filterUrlModule[0];
    }

    sortModule(moduleList: any[]) {
        moduleList.sort(function (m1: any, m2: any) {
            if (Number(m1.role.id) > Number(m2.role.id)) {
                return -1;
            }
            if (Number(m1.role.id) < Number(m2.role.id)) {
                return -1;
            }
            return 0;
        });

        return moduleList;
    }

    public upgradeUser() {
        this.User.getResponse();
    }
}