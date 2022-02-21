import { Component, Inject, Injector, OnInit, Injectable } from '@angular/core';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core'
import swal from 'sweetalert2';

//MATERIAL
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//SERVICES
import { AuthService } from '@app/core/services/sesion/auth.service';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';

//MODELS
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';

@Component({
  selector: 'app-update-modal-operations',
  templateUrl: './update-modal-operations.component.html',
  styleUrls: ['./update-modal-operations.component.sass']
})
@Injectable({providedIn: 'root'})

export class UpdateModalOperationsComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private idOperation:any={};
  public showLoad: boolean = false;
  private loaderDuration: number;
  private authService:AuthService;

  constructor(private changeDetectorRef: ChangeDetectorRef, private injector:Injector, public refData?:MatDialogRef<UpdateModalOperationsComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) {
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.authService = this.injector.get<AuthService>(AuthService);
    this.refData?.updateSize('70%');
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.reactiveForm.setContainers(this.containers);
    this.dataModal.dataModal.status = this.dataModal.dataModal.status == "A"?"true":"false";
    this.idOperation = this.getIdOperation();
    this.control.setDataToControls(this.containers,this.dataModal.dataModal);
    this.dataModal.dataModal.status = this.dataModal.dataModal.status == "true"?"A":"I";
    this.reactiveForm.setContainers(this.containers);
  }

  getIdOperation(){
    let oData:{[k:string]:any}={};
    oData.idTipoOperacion = parseInt(this.dataModal?.dataModal.idTipoOperacion,10);
    return oData;
  }

  update(){
    if(!this.authService.isAuthenticated())
      this.close();
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }

    let jsonResult = this.reactiveForm.getModifyContainers(this.containers);
     var obOpe:Operaciones = new Operaciones();
     obOpe.idTipoOperacion = jsonResult.idTipoOperacion
     obOpe.descripcionTipoOperacion = jsonResult.descripcion.trim()
     obOpe.idCanal = jsonResult.canal
     obOpe.topicoKafka = jsonResult.topicoKafka.trim()
     obOpe.status = jsonResult.estatus === true ?"A":"I"
    
    this.showLoader(true);
    this.formCatService.updateOperation(obOpe)
      .pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        console.log(response.code)
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
            swal.fire({
              icon: 'success',
              title: 'Solicitud correcta',
              text: response.mensaje,
              heightAuto: false,
              allowOutsideClick: false,
              confirmButtonText: "Ok"
            }).then((result)=>{
              if(result.isConfirmed){
                this.getDataTable();
              }
            });;
            break;
          case 400: //Solicitud incorrecta
            swal.fire({
              icon: 'warning',
              title: 'Solicitud incorrecta',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          case 401://No autorizado
            swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          case 500://Error Inesperado
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          default: break;
        }
      }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Por el momento no podemos proporcionar tu Solicitud.',
          heightAuto: false
        });
      });
  }

  close(){
    let oResponse:ResponseTable= new ResponseTable();
    return(
    this.refData?.close(oResponse)
    );
   }

   ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

  addDataDropdown(dataForm:any, dataContent:any){
    dataForm.forEach((element:any) => {
      element.controls.forEach((ctrl:any) => {
        if(ctrl.controlType === 'dropdown'){
          ctrl.content.contentList = dataContent;
          ctrl.content.options = dataContent;
        }
      });
    });
    return dataForm;
  }


  getDataTable(){
    let oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.formCatService.getInfoOperation().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
          return(
            oResponse.status = true,
            oResponse.data = response.response,
            this.refData?.close(oResponse)
          );
          case 400:
          case 401:
          case 500:
          default:
            return(
              this.refData?.close(oResponse),
              swal.fire({
                icon: 'error',
                title:'Error',
                text: 'Ocurrio un error inesperado, intente más tarde.',
                heightAuto: false
              })
            );
        }
      }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error inesperado, intente más tarde.',
          heightAuto: false
        });
      });
  }

}
