import { Component, Inject, Injector, OnInit, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';
import { AppComponent } from '@app/app.component';
import { finalize } from 'rxjs/operators';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import swal from 'sweetalert2';
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
  //private appComponent: AppComponent
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private idData:any={};
  private resultTable:any={};
  public showLoad: boolean = false;
  private loaderDuration: number;

  constructor(private changeDetectorRef: ChangeDetectorRef, private injector:Injector, public refData?:MatDialogRef<UpdateModalOperationsComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) {
    //this.appComponent = this.injector.get<AppComponent>(AppComponent);
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
  }

  ngOnInit(): void {
    let dataChanel = this.dataModal.dataChanel;
    let auxForm = this.dataModal.auxForm;
    delete this.dataModal.dataChanel;
    delete this.dataModal.auxForm;
    this.containers = this.addDataDropdown(auxForm.reactiveForm, dataChanel);
    this.reactiveForm.setContainers(this.containers);
    this.dataModal.dataModal.status = this.dataModal.dataModal.status == "A"?"true":"false";
    this.idData = this.getIdData();
    this.control.setDataToControls(this.containers,this.control.deleteValuesForSettings(this.dataModal,1,1));
    this.dataModal.dataModal.status = this.dataModal.dataModal.status == "true"?"A":"I";
    this.reactiveForm.setContainers(this.containers);
  }

  getIdData(){
    let oData:{[k:string]:any}={};
    var key = this.dataModal?.keys[0];
    oData[key] = parseInt(this.dataModal?.dataModal[key]);
    return oData;
  }

  update(){
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }

    let jsonResult = this.reactiveForm.getModifyContainers(this.containers, this.idData);
     var obOperacion:Operaciones = {
      idTipoOperacion: jsonResult.idTipoOperacion,
      descripcionTipoOperacion: jsonResult.descripcion,
      idCanal: jsonResult.canal,
      topicoKafka: jsonResult.topicoKafka,
      status: jsonResult.estatus === true ?"A":"I"
    }
    this.showLoader(true);

    this.formCatService.updateOperation(obOperacion)
      .pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
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
    this.refData?.close(oResponse);
   }

   ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
      console.log('showload', this.showLoad);
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
    this.formCatService.getData().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
            oResponse.status = true;
            oResponse.data = response.response;
            this.refData?.close(oResponse);
          break;
          case 400:
          case 401:
          case 500:
          default:
            this.refData?.close(oResponse);
            swal.fire({
              icon: 'error',
              title:'Error',
              text: 'Ocurrio un error inesperado, intente más tarde.',
              heightAuto: false
            });
            break;
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
