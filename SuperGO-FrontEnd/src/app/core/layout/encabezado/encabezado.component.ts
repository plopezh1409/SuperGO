import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isObservable, Subscription} from 'rxjs';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

//SERVICIOS

import { AuthService } from '../../services/sesion/auth.service';
import { MasterKeyService } from '../../services/sesion/masterKey.service';

//COMPONENTS
import { AppComponent } from '@app/app.component';

//MODULES
import { Page } from '../../models/public/page.module';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.sass']
})
export class EncabezadoComponent implements OnInit {  

  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber(); 
  mobileQuery: MediaQueryList;
  fillerNav = ['Nueva solicitud', 'Seguimiento de solicitudes-------', 'Ayuda'];  

  private _mobileQueryListener: () => void;

  private usuarioStorage: any;
  public rolStorage: any;
  @Input() showLogo =false;
  nombreEmpleado: string;
  idRole: number;
  role: string;  
  idDireccion: number;
  direccion: string;
  idPais: number;
  pais: string;
  numeroEmpleado: string;
  foto: any;
  empresa: string;
  idEmpresa: number;  
  modulos: any;
  rutas = [];
  interruptor: boolean;  
  private llaveMaestraService: MasterKeyService;
  public authService: AuthService;  
  
  
  listaMenu:any[];
  subscriptionModule: Subscription;  
  subscriptionCloseSession: Subscription;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,               
    private location: Location,
    public injector:Injector,
    private appComponent: AppComponent,    
  ) {    
    this.llaveMaestraService = this.injector.get<MasterKeyService>(MasterKeyService);
    this.authService = this.injector.get<AuthService>(AuthService);    
    this.idPais = 0;
    this.pais = '';
    this.idDireccion = 0;
    this.direccion = '';
    this.numeroEmpleado = '';
    this.nombreEmpleado = '';    
    this.idRole = 0;
    this.role = '';      
    this.foto = '';
    this.empresa = '';
    this.idEmpresa = 0;    
    
    this.interruptor = false;        
    this.listaMenu = [];    
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      
    this.subscriptionModule = this.authService.roleName.subscribe(roleName => {      
      if(this.usuarioStorage)
      {        
        if(roleName!=='null')
        {
          this.role = roleName;
        }
      }      
     });

    this.subscriptionCloseSession = this.authService.isClosed.subscribe(x=>{
      setTimeout(() => {        
        if(this.authService.token === null || this.authService.token.length<=0)
        {
          this.appComponent.isAuth = false;
        }        
      }, Number(this.codeResponseMagic.RESPONSE_CODE_100));      
    });
  } 
   
  ngOnInit(): void {       
    this.usuarioStorage = this.authService.usuario;       
    this.loadHeader();    
    this.loadModules();    
  }  

  public loadHeader(): void {        
    this.nombreEmpleado = this.usuarioStorage.name;
    this.idPais = this.usuarioStorage.country.id;
    this.pais = this.usuarioStorage.country.name;
    this.idDireccion=this.usuarioStorage.direction.id;
    this.direccion=this.usuarioStorage.direction.name;
    this.numeroEmpleado = this.usuarioStorage.employee;
    this.empresa = this.usuarioStorage.company;   

    this.foto=`assets/img/image/account_circle-24px.svg`;
    if(this.empresa!==undefined && this.numeroEmpleado!==undefined)
    {
      this.foto = `https://portal.socio.gs/foto/${this.empresa}/empleados/${this.numeroEmpleado}.jpg`;
    }
  } 
  
  logout(): void {        
    const actMk = this.authService.isActiveMasterKey;
    if(isObservable(actMk))
    {        
      this.appComponent.showLoader(true);
      actMk.pipe(finalize(() => this.appComponent.showLoader(false))).subscribe(result=>{                
        this.closeSession(result);
      });
    }
    else{                 
      this.closeSession(actMk);
    }   
  }

  closeSession(activarLLaveMaestra:boolean){
    this.authService.logout().subscribe(()=>{
      if (activarLLaveMaestra) {
        window.location.href = this.llaveMaestraService.logout();          
      } 
      else 
      {
        swal.fire({
          icon: 'success',
          title: 'Cerrando sesi??n',
          text: `Has cerrado sesi??n con ??xito!`,
          heightAuto: false
        });
        this.router.navigate(['/login']);
        this.appComponent.isAuth = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
  
  loadModules(){    
    this.listaMenu=[];
    if(this.usuarioStorage.modules!==undefined && this.usuarioStorage.modules.length>0)
    { 
      this.usuarioStorage.modules.forEach((element:Page) => {
        if(!this.listaMenu.find(x=>x.name === element.module.name))
        {
          this.listaMenu.push(element.module);
        }        
      });
    }
  }

  changeRole(module:any, snav:any)
  {
    this.role = '';
    snav.close();    
    if(module!=null)
    {
      let findRole = this.usuarioStorage.modules.filter((m:any) => Number(m.module.id) === Number(module.id));      
        if(findRole && findRole.length>0)
        {
          findRole = this.authService.sortModule(findRole);
          this.usuarioStorage.selectedModule = findRole[0];
          this.role = findRole[0].role.name;
        }              
    }
  } 
}
