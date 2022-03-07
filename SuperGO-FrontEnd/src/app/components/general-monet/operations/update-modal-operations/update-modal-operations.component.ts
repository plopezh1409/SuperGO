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
import { SwalDirective } from '@sweetalert2/ngx-sweetalert2';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

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
  private idOperation:number=0;
  public showLoad: boolean = false;
  private loaderDuration: number;
  private authService:AuthService;
  messageError:MessageErrorModule;

  constructor(private changeDetectorRef: ChangeDetectorRef, private injector:Injector, public refData?:MatDialogRef<UpdateModalOperationsComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) {
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.authService = this.injector.get<AuthService>(AuthService);
    this.messageError = new MessageErrorModule;
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.reactiveForm.setContainers(this.containers);
    this.dataModal.dataModal.status = this.dataModal.dataModal.status == "A"?"true":"false";
    this.idOperation = this.idOperation = parseInt(this.dataModal?.dataModal.idTipoOperacion,10);
    this.control.setDataToControls(this.containers,this.dataModal.dataModal);
    this.dataModal.dataModal.status = this.dataModal.dataModal.status == "true"?"A":"I";
    this.reactiveForm.setContainers(this.containers);
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
     obOpe.idTipoOperacion = this.idOperation;
     obOpe.descripcionTipoOperacion = jsonResult.descripcionTipoOperacion.trim();
     obOpe.idCanal = parseInt(jsonResult.idCanal,10);
     obOpe.topicoKafka = jsonResult.topicoKafka.trim()
     obOpe.status = jsonResult.estatus === true ?"A":"I"
    this.showLoader(true);
    this.formCatService.updateOperation(obOpe).pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        if(response.code == 200){
          swal.fire({
            icon: 'success',
            title: 'Solicitud correcta',
            text: response.mensaje,
            heightAuto: false,
            allowOutsideClick: false,
            confirmButtonText: "Ok"
          }).then((result)=>{
            if(result.isConfirmed)
              this.getDataTable();
          });
        }
        else{
          this.messageError.showMessageError(response.message ,response.code);
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

  getDataTable(){
    let oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.formCatService.getInfoOperation().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200:
          return(
            oResponse.status = true,
            oResponse.data = response.response,
            this.refData?.close(oResponse)
          );
          case 400:
          case 401:
          case 404:
          case 500:
            return(
              this.refData?.close(oResponse),
              swal.fire({
                icon: 'error',
                title:'Error',
                text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
                heightAuto: false
              })
            );
            default:
              break;
        }
      }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
          heightAuto: false
        });
      });
  }

}
