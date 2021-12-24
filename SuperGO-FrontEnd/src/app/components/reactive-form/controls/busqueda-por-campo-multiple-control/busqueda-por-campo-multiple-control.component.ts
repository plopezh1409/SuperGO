import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { finalize, pluck } from 'rxjs/operators';
import { FormService } from '@app/core/services/capture/form.service';
import Swal from 'sweetalert2';
import { Control } from '@app/core/models/capture/controls.model';
import { element } from 'protractor';

@Component({
  selector: 'app-busqueda-por-campo-multiple-control',
  templateUrl: './busqueda-por-campo-multiple-control.component.html',
  styleUrls: ['./busqueda-por-campo-multiple-control.component.sass']
})
export class BusquedaPorCampoMultipleControlComponent implements OnInit {
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  @Input() controlesDesdeBackend!: any;
  @Input() objetosDependenciaBusquedaVsInfo: any;
  setError: boolean = false;
  mask:any; 
  
  @Input() set setErrores (val:any) {
    if(val) {
      this.setError = true
    } else {
      this.setError = false
    }
  }
  private errorSet = false;
  private formularioService: FormService;
  private nombresCampos: string[] = [];
  private consulta: string = '';
  private banderaBlur: boolean = false;
  private banderaClick: boolean = false;
  
  //icono de status: -1 = "no mostrar" 0 = "error", 1 = "valido", cualquier otro = "icono buscar"
  public setIconoStatus = 2;
  public mostrarLoaderInput = false;
  controlClass:string='';
  constructor(formularioService: FormService) {
    this.formularioService = formularioService;
  }

  ngOnInit(): void {
    this.mask = this.control.getMask();
    this.control.isVerify = -1;   
    this.controlClass = (this.formulario.get(this.control.ky!)?.errors?.required!=undefined && this.formulario.get(this.control.ky!)?.errors?.required == true)? 
    'form-react-form-field-Color':'form-react-form-field';     
  }

  validarDependenciasDeCampos(controlForm: AbstractControl | null): void {
    this.nombresCampos = [];

    // verificando que se tenga la informacion del servicio a consultar
    if (controlForm === null) {
      throw new Error('No se identificó el campo a consultar ');
    }

    if (
      this.control.content!.endpoint === null ||
      this.control.content!.endpoint!.trim().indexOf('') === 1
    ) {
      throw new Error('No se tiene configurada una búsqueda para este campo');
    }

    if (controlForm.errors !== null) {
      return;
    }

    // Validando las dependencias que tiene la consulta
    this.consulta = this.control.content!.endpoint!.split('|').length>=2? this.control.content!.endpoint!.split('|')[1]:this.control.content!.endpoint!;
    this.consulta = this.consulta.split('[').length>=2?this.consulta.split('[')[1].replace('[','').replace(']',''):this.consulta;
    this.consulta.split(',').forEach((key, index) => {
      this.nombresCampos.push(key.split(':')[1].replace('{','').replace('}','').replace('[','').replace(']','').replace(/[']/g,''));
    });
  }

  buscarCamposInfo(data?:any):void{ 
    if(this.objetosDependenciaBusquedaVsInfo != undefined && this.objetosDependenciaBusquedaVsInfo.length>0)
    {
      if(data!=undefined)
      {         
        let hasMsje = Object.keys(data).filter(k => k=='message');
        if(hasMsje.length>0)
        {
          this.mostrarLoaderInput = false;
          this.setIconoStatus = 0;
          this.formulario.controls[this.control.ky!].setValue('');
          Swal.fire({html:`<div class="titModal">No se encontro información válida </div><br>Se encontró el siguiente problema al momento de buscar la información: ${data[hasMsje[0]]}`});
          return;
        }

        let field = Object.keys(data).find(k=>{return k.trim().toUpperCase() == this.control.ky;});
        if(field)
        {
          this.formulario.controls[this.control.ky!].setValue(data[field]);
        }        

        this.objetosDependenciaBusquedaVsInfo.forEach((elem:any) => {
          console.log("objetosDependenciaBusquedaVsInfo",elem);
          let field = Object.keys(data).find(k=>{return k.trim().toUpperCase() == elem.dependency.trim().toUpperCase();});
          if(field)
          {
            console.log("objetosDependenciaBusquedaVsInfo data[field]",data[field]);
            this.formulario.controls[elem.ky].setValue(data[field]);
          }
        });       
      }
      else
      {        
        this.objetosDependenciaBusquedaVsInfo.forEach((ctrl:Control) =>{
          this.formulario.controls[ctrl.ky!].setValue("");
        });
      }
    }    
  }

  enviarConsulta(url: string) {
    // lanzar la consulta de validacion
    let str:string[] = url.split('|');
    let obj:any = null;
    if(str.length>=2)
    {
      url = str[0];
      obj = str[1];
    }
    console.log("enviarConsulta", url,"obj",obj);
    this.formularioService.getFieldQuery(url, obj) 
    .pipe(finalize(()=>{ this.mostrarLoaderInput = false;}))
    .subscribe((data: any) => {        
        if(data.code==200)
        {
          this.setIconoStatus = 1;          
          this.buscarCamposInfo(data.response);
        }
        else
        {          
          this.setIconoStatus = 0;
          this.formulario.controls[this.control.ky!].setValue('');
          Swal.fire({html:`<div class="titModal">Aviso </div><br/>No se encontro información`});          
        }
      },
      (error: any) => {        
        this.setIconoStatus = 0;
        this.formulario.controls[this.control.ky!].setValue('');
      });
  }

  onClickBuscar() {
    if (!this.banderaBlur) {
      this.banderaBlur = false;
      this.banderaClick = true;
      if (this.nombresCampos.length == 0) {
        this.validarDependenciasDeCampos(this.formulario);
      }
      this.pintarComoErrorDependencias();
    }   
  }

  onBlurInput() {
    this.banderaBlur = true;

    if (this.nombresCampos.length == 0) {
      this.validarDependenciasDeCampos(this.formulario);
    }
    this.pintarComoErrorDependencias();
    this.banderaBlur = false;
    this.consulta = this.control.content!.endpoint!;
    if (!this.errorSet && !this.banderaClick && !this.setError)  {
      this.nombresCampos.forEach((key, index) => {
        if(this.formulario.controls[key]!=undefined)
        {
          this.consulta = this.consulta.replace(key,this.formulario.controls[key].value);
        }        
      });
      this.mostrarLoaderInput = true;
      this.setIconoStatus = -1;
      this.enviarConsulta(this.consulta);
    }
   
  }

  onInput() {
    if (!this.formulario.get(this.control.ky!)?.errors) {
      this.setIconoStatus = 2;      
      this.buscarCamposInfo();
    }
    if(this.formulario.get(this.control.ky!)?.errors && this.setIconoStatus == 1 ) {
      this.setIconoStatus = 2;      
      this.buscarCamposInfo();
    }
  }

  buscarErroresDependencias(): boolean {
    let err = false;

    this.nombresCampos.forEach((campo) => {
      if (this.formulario.get(campo)?.errors !== null) {
        err = true;
      }
    });

    return err;
  }

  pintarComoErrorDependencias() {
    this.errorSet = false;

    this.nombresCampos.forEach((key, index) => {
      if(this.formulario.controls[key]!=undefined)
      {
        if (this.formulario.controls[key].errors) {
          this.errorSet = true;
          this.formulario.controls[key].markAsTouched();
        }
  
        if (index == this.nombresCampos.length - 1 && this.errorSet === false) {
          this.errorSet = false;
        }
      }      
    });
  }
  
  onChangeInput() {
    setTimeout(() => {
      if(this.setError) {
        this.formulario.controls[this.control.ky!].setValue("");
        this.setError = false;
      }
    }, 100);
   
  }
}

