import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { FormService } from '@app/core/services/capture/form.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-busqueda-por-campo-control',
  templateUrl: './busqueda-por-campo-control.component.html',
  styleUrls: ['./busqueda-por-campo-control.component.sass']
})
export class BusquedaPorCampoControlComponent implements OnInit 
{

  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  @Input() control!: Control;
  @Input() formulario!: FormGroup;
  @Input() controlesDesdeBackend!: any;
  @Input() objetosDependenciaBusquedaVsInfo: any;
  setError = false;
  mask:any;

  @Input() set setErrores (val:any) {
    if(val) {
      this.setError = true;
    } else {
      this.setError = false;
    }
  }
  private errorSet = false;
  private readonly formularioService: FormService;
  private nombresCampos: string[] = [];
  private consulta= '';
  private banderaBlur = false;
  private banderaClick = false;
  
  public setIconoStatus:number;
  public mostrarLoaderInput = false;
  controlClass='';

  constructor(formularioService: FormService) {
    this.formularioService = formularioService;
    this.setIconoStatus = 2;
  }

  ngOnInit(): void {
    this.mask = this.control.getMask();
    this.control.isVerify = -1;
    if(this.control.ky)
    {
      this.controlClass = (this.formulario.get(this.control.ky)?.errors?.required!==undefined && this.formulario.get(this.control.ky)?.errors?.required === true)? 
      'form-react-form-field-Color':'form-react-form-field';        
    }    
  }

  validarDependenciasDeCampos(controlForm: AbstractControl | null): void {
    this.nombresCampos = [];

    // verificando que se tenga la informacion del servicio a consultar
    if (controlForm === null) {
      throw new Error('No se identificó el campo a consultar ');
    }


    if(
      this.control.content &&
      (this.control.content.endpoint === null ||this.control.content.endpoint.trim().indexOf('') === 1)
      ) 
      {
        throw new Error('No se tiene configurada una búsqueda para este campo');
      }

    if (controlForm.errors !== null) {
      return;
    }

    // Validando las dependencias que tiene la consulta
    const sizeEndpoint=2;
    if(this.control.content)
    {
      this.consulta = this.control.content.endpoint!.split('|').length>=sizeEndpoint? this.control.content.endpoint!.split('|')[1]:this.control.content.endpoint!;
    }    

    this.consulta.split(',').forEach((key, index) => {
      this.nombresCampos.push(key.split(':')[1].replace('{','').replace('}','').replace(/[']/g,''));
    });
  }

  buscaCampoParaImprimirResultadoConsulta(): any {
    if (this.objetosDependenciaBusquedaVsInfo.length > 0) {      
      return this.objetosDependenciaBusquedaVsInfo[0];      
    }
    return null;
  }

  enviarConsulta(url: string) {
    const sizeEndpoint=2;
    // lanzar la consulta de validacion
    const str:string[] = url.split('|');
    let obj:any = null;
    if(str.length>=sizeEndpoint)
    {
      url = str[0];
      obj = str[1];
    }
    this.formularioService.getFieldQuery(url, obj)
    .pipe(finalize(()=>{ this.mostrarLoaderInput = false;}))
    .subscribe(
      (data: any) => {
        if (data.code === this.codeResponse.RESPONSE_CODE_200) {
          const {response} = data;          
          //this.formulario.controls[this.control.ky!].setValue(response[this.control.ky!.toLowerCase()]);          
          this.setIconoStatus = 1;          
          const campoAImprimir = this.buscaCampoParaImprimirResultadoConsulta();
          if (campoAImprimir) {                        
            this.formulario.controls[campoAImprimir.ky!].setValue(response[campoAImprimir.dependency]);
          }
        }
      },
      (error: any) => {        
        this.setIconoStatus = 0;
        this.formulario.controls[this.control.ky!].setValue('');
      }
    );
  }

  onClickBuscar() {
    if (!this.banderaBlur) {
      this.banderaBlur = false;
      this.banderaClick = true;
      if (this.nombresCampos.length === 0) {
        this.validarDependenciasDeCampos(this.formulario);
      }
      this.pintarComoErrorDependencias();
    }    
  }

  onBlurInput() {
    this.banderaBlur = true;

    if (this.nombresCampos.length === 0) {
      this.validarDependenciasDeCampos(this.formulario);
    }
    this.pintarComoErrorDependencias();
    this.banderaBlur = false;
    this.consulta = this.control.content!.endpoint!;
    if (!this.errorSet && !this.banderaClick && !this.setError)  {
      this.nombresCampos.forEach((key, index) => {
        if(this.formulario.get(key)!=null)
        {
          this.consulta = this.consulta.replace(
            key,
            this.formulario.controls[key].value
          );
        }       
      });
      this.mostrarLoaderInput = true;
      this.setIconoStatus = -1;
      this.enviarConsulta(this.consulta);
    }
   
  }

  onInput() {
    if (this.control.ky && !this.formulario.get(this.control.ky)?.errors) {
      this.setIconoStatus = 2;
      const campoAImprimir = this.buscaCampoParaImprimirResultadoConsulta();
      if (campoAImprimir) {
        this.formulario.controls[campoAImprimir.ky!].setValue('');
      }
    }
    if(this.control.ky && this.formulario.get(this.control.ky)?.errors && this.setIconoStatus === 1 ) {
      this.setIconoStatus = 2;
      const campoAImprimir = this.buscaCampoParaImprimirResultadoConsulta();
      if (campoAImprimir) {
        this.formulario.controls[campoAImprimir.ky!].setValue('');
      }
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
      if(this.formulario.get(key)!=null)
      {
        if (this.formulario.controls[key].errors) {
          this.errorSet = true;
          this.formulario.controls[key].markAsTouched();
        }
  
        if (index === this.nombresCampos.length - 1 && this.errorSet === false) {
          this.errorSet = false;
        }
      }      
    });
  }
  
  onChangeInput() {
    const timeout=100;
    setTimeout(() => {
      if(this.setError) {
        if(this.control.ky)
        {
          this.formulario.controls[this.control.ky].setValue('');          
        } 

        this.setError = false;       
      }
    }, timeout);
   
  }
}


