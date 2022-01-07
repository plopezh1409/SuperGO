import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { finalize, map, pluck } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';
import { StorageService } from '@app/core/services/public/storage.service';
import { DeviceDetectorService } from 'ngx-device-detector';

//MODELOS
import { Sesion } from '../../models/sesion/sesion.model';
import { User } from '../../models/public/user.model';

//ENVIROMENT
import { environment } from '@env/environment';
import { Page } from '@app/core/models/public/page.module';

@Injectable({
    providedIn: 'root'
})
export class AuthService {    
    private _usuario: any;
    private _token: any;
    private _rol:any;
    private _module:any;
    private storage: any;
    private _payload: any;
    private _payloadAjustado:number;
    private _urlEnviroment:string|null;
    private activateMasterKey:boolean|null;    
    private storageService: StorageService;    
    deviceInfo: any = null; 
    private _roleName:BehaviorSubject<string>;        
    private _isClosed:BehaviorSubject<any>;
    roleName: Observable<any>;
    isClosed: Observable<any>;
    private minuteAjustTime=120;

    constructor(
        public injector:Injector,
        private http: HttpClient,
        private angularSecurity: AngularSecurity,        
        public deviceService: DeviceDetectorService,                       
        private router: Router,
        private logger: NGXLogger        
    ) { 
        this._usuario = null;
        this._payload = null;
        this._payloadAjustado = 0;

        //token es necesario en nulo para llevar a cabo la validacion de la propiedad get Token correctamente 
        this._token = null;
        this._urlEnviroment = null;
        this.activateMasterKey = null;
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.storageService= this.injector.get<StorageService>(StorageService);       
        this._roleName = new BehaviorSubject('null');
        this.roleName = this._roleName.asObservable();
        this._isClosed = new BehaviorSubject('');
        this.isClosed = this._isClosed.asObservable();
    }

    public get usuario(): User {
        if (this._usuario != null) {
            return this._usuario;
        } else if (this._usuario == null && localStorage.getItem(this.angularSecurity.getStorageUser) != null) {
            this._usuario = this.storageService.decryptUserStorage();
            return this._usuario;
        }
        return new User();
    }

    public get token(): string| null {                
        if (this._token != null && this._token.trim().length>0) {
            return this._token;
        } 
        else if (this._token == null && localStorage.getItem(this.angularSecurity.getStorageToken) != null) {            
            this._token = this.storageService.decryptTokenStorage();
            return (this._token!=null && this._token.trim().length>0)?this.token:null;
        }
        return null;
    }   

    public set selectedModule(module:any)
    {        
        this.storageService.encryptSelectedModuleStorage(module);
    }    

    public get selectedModule(): any
    {
        if (this._module != null) {
            return this._module;
        }else if (this._module == null && this.storageService.decryptSelectedRoleStorage() != null) {
            this._module = this.storageService.decryptUserStorage();
            return this._module;
        }
        return {} as Page;
    }

    public get payload():any {
        if(this._payload!=null)
        {
            return this._payload;
        }
        else if (this._token != null)
        {
            this._payload = this.obtenerDatosToken(this._token);
            return this._payload;
        }
        return null;

    }

    public get urlEnviroment()
    {
        if(this._urlEnviroment!=null)
        {
            return this._urlEnviroment;
        }
        else
        {
            let urlCle = this.angularSecurity.getKeyAES;
            this._urlEnviroment = this.angularSecurity.decryptAES(environment.urlSuperGo, urlCle);
            // let des = 'http://10.112.69.181:8090/APIGO/';
            // let enc = this.angularSecurity.encryptAES(des, urlCle);
            // console.log("MENSAJE ENCRIPTADO:", enc);
            // console.log("MENSAJE Desencriptado:", this.angularSecurity.decryptAES(enc, urlCle));
            return this._urlEnviroment;
        }
    }  
    
    public get isActiveMasterKey():boolean|Observable<boolean>
    {
        if(this.activateMasterKey!=null)
        {
            return this.activateMasterKey;
        }
        else{            
            return this.getFlagMasterKey()
                .pipe(pluck("response") ,map((resultado: boolean) => {                
                this.activateMasterKey = resultado;
                return this.activateMasterKey;
            }));
        }
    }    

    public get sessionTime()
    {
        if(this.payload)
        {
            this._payloadAjustado = ((this.payload.exp) - this.minuteAjustTime) || 0;
        }
        
        return this._payloadAjustado;
    }

    guardarUsuario(accessToken: string): void {
        let payload = this.obtenerDatosToken(accessToken);
        let keyAES: any = this.angularSecurity.getKeyAES;        
        this._usuario = JSON.parse(this.angularSecurity.decryptAES2(payload.info, keyAES));        
        this.storageService.encryptUserStorage(this._usuario);
    }

    guardarToken(accessToken: any): void {
        // Limpiamos variables para la renovacion de Token
        this._usuario = null;
        this._token = null;
        this._payload = null;
        this._payloadAjustado = 0;        
        this._token = accessToken;        
        this.storageService.encryptTokenStorage(this._token);
        this.IsCloseSystem();
    }

    obtenerDatosToken(accessToken: string): any {
        if (accessToken != null && accessToken != "") {
            return JSON.parse(decodeURIComponent(escape(atob(accessToken.split(".")[1]))));
        }
        return null;
    }

    isAuthenticated(): boolean {
        if(this._token == null)
        {
            this._token = this.storageService.decryptTokenStorage();
        }
        
        if (this._token != null) {
            let keyAES: any = this.angularSecurity.getKeyAES;
            let payload = this.obtenerDatosToken(this._token);
            let info: any = JSON.parse(this.angularSecurity.decryptAES2(payload.info, keyAES));
            if (info != null && info.name && info.name.length > 0) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }     

    limpiarSesion()
    {
        this._token = null!;
        this._usuario = null!;
        this._payloadAjustado = 0;
        this._payload = null;        
        localStorage.clear();
        localStorage.removeItem(this.angularSecurity.getStorageToken);
        localStorage.removeItem(this.angularSecurity.getStorageUser);
        localStorage.removeItem(this.angularSecurity.getStoragerSelectedRole);
    }

    isTokenExpirado()
    {       
        // HORA DE EXPIRACIÓN DEL TOKEN        
        this._payloadAjustado = ((this.payload.exp) - this.minuteAjustTime) || 0; // -> SE RESTAN 2 MINUTOS PARA RENOVAR ANTES DE QUE SE ACABE EL TIEMPO REAL DEL TOKEN                
        let now = (new Date().getTime() / 1000); //HORA LOCAL ACTUAL
        this.logger.info("AuthService isTokenExpirado, TiempoExp:", new Date(this.payload.exp*1000),"TiempoAjust", new Date(this._payloadAjustado*1000), "TiempoActual",new Date(now*1000));

        if (this._payloadAjustado < now) {
          return true;
        }
        return false;
    }

    terminarSesion(ruta:string, mensaje:string) {
        this.limpiarSesion();
        this.router.navigate([ruta]); 
        this.IsCloseSystem();   
        swal.fire({
            html: `<div class="titModal">Aviso</div><br/>
            <span class="material-icons error-icon">error</span><br/>
            <div>${mensaje}</div>`,
            allowOutsideClick: false,
            heightAuto: false,
            confirmButtonText: 'Aceptar',
        });
    }

    newSession(token: any): Observable<any>  {
        this.logger.info("Nueva session AuthService, llamando a renovar token");
        return this.tokenRefresh(token).pipe(map(data=>{
            if (data.code === 200) {
                //this.logger.info("Nueva session AuthService,NUEVO TOKEN ",data.response);
                if (data.response !== null && data.response.length > 0) {
                    this.guardarToken(data.response);
                    this.guardarUsuario(data.response);                    
                }                    
            }
            return data;
        }));
    }

    logout(): Observable<any> {   
        return this.http.post(`${this.urlEnviroment}login/logout`, null).pipe(
            finalize(()=>{this.limpiarSesion();}));
        }

    login(loginObj: any): Observable<any> {
        return this.http.post<Sesion>(`${this.urlEnviroment}login`, loginObj);
    }

    updatePassword(body: any): Observable<any>
    {
        return this.http.post<any>(`${this.urlEnviroment}login/update`, body);
    }    

    tokenRefresh(accessToken: any): Observable<any> {        
        this._token = accessToken;
        return this.http.post(`${this.urlEnviroment}login/refresh`, {textoX:""});
    }

    getFlagMasterKey(): Observable<any> {      
        return this.http.post(`${this.urlEnviroment}flag/masterkey`,{"text":"1"});
    }

    getModuleByUrl(url: string)
    {
        let filterUrlModule:any[]=[];
        const {modules} = this.usuario;
        if(!modules)
        {
          swal.fire({
            icon: 'warning',
            title: 'Accesso denegado',
            text: 'No tienes permisos asignados',
            heightAuto: false
          });
          return null;
        }

        modules.forEach(page => {
            const {operation} = page.module;
            if(operation )
            {
                let filter = operation.filter(op=> url.includes(op.url) && op.url.trim().length>0); 
                if(filter.length>0)
                {
                  filterUrlModule = filterUrlModule.concat(page);
                }
            }           
          });
         
          if(filterUrlModule.length <= 0)          
          {
            filterUrlModule=[];
            filterUrlModule = modules.filter(page => url === page.module.url);
            console.log("URL",url);
            console.log("PAGE",filterUrlModule);
            
            if(filterUrlModule.length<=0)
            {
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
    
    sortModule(moduleList:any[])
    {
        moduleList.sort(function(m1:any, m2:any){
        if(Number(m1.role.id) > Number(m2.role.id))
        {
            return -1;
        }          
        if(Number(m1.role.id) < Number(m2.role.id))
        {
            return -1;
        }
        return 0;
        });

        return moduleList;
    }

    getRoleName(_roleName:string)
    {
        this._roleName.next(_roleName);
    }

    IsCloseSystem()
    {
        this._isClosed.next("cerrar sesion");
    }

    public upgradeUser(usuario: User)
    {
        this.storageService.encryptUserStorage(usuario);
    }    
}