import { Component, Injector, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from '@app/core/services/sesion/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-monetizer',
  templateUrl: './home-monetizer.component.html',
  styleUrls: ['./home-monetizer.component.sass']
})
export class HomeMonetizerComponent implements OnInit {
  public listaMenu:any[];
  public authService: AuthService;  
 
  constructor(private readonly router: Router, public injector:Injector) 
  { 
    this.authService = this.injector.get<AuthService>(AuthService);    
    this.listaMenu = [];
  }

  
  ngOnInit(): void {    
    this.loadPetitions();
  }
  
  loadPetitions()
  {
    this.listaMenu=[];
    if(this.authService.isAuthenticated())
    {
      const {modules} = this.authService.usuario;
      if(!modules)
      {
        this.withoutPetitions();        
        return;
      }
      modules.forEach(x=>{      
        const {operation}  = x.module;
        if(operation)
        {
          const filter = operation.filter(op=> op.url.includes(this.router.url)); 
          if(filter.length>0)
          {
            this.listaMenu = this.listaMenu.concat(filter);
          }
        }
      });

      if(this.listaMenu.length <= 0)
      {
        this.withoutPetitions();
      }    
    }
  }

  redirectUrl(i:any){       
    const module = this.authService.getModuleByUrl(this.listaMenu[i].url);
    if(module)
    {
      this.authService.getRoleName(module.role.name);
      this.router.navigateByUrl(this.listaMenu[i].url);
    }
  }

  withoutPetitions(){
    Swal.fire({
      icon: 'warning',
      title: 'Sin Solicitudes',
      text: 'No tienes solicitudes asignadas',
      heightAuto: false
    });
  }
}
