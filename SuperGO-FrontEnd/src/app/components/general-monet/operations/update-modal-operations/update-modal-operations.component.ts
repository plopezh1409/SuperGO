import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';
import { AppComponent } from '@app/app.component';
import { finalize } from 'rxjs/operators';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import swal from 'sweetalert2';

@Component({
  selector: 'app-update-modal-operations',
  templateUrl: './update-modal-operations.component.html',
  styleUrls: ['./update-modal-operations.component.sass']
})

export class UpdateModalOperationsComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private idData:any={};
  
  constructor(private changeDetectorRef: ChangeDetectorRef, private injector:Injector, public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
  }

  ngOnInit(): void {
    this.formCatService.getForm().pipe(finalize(() => {  })).subscribe((data:any)=>{
      let dataChanel = this.dataModal.dataChanel;
      delete this.dataModal.dataChanel;
      this.containers = this.addDataDropdown(data.response.reactiveForm, dataChanel);
      this.reactiveForm.setContainers(this.containers);
      this.dataModal.dataModal.status = this.dataModal.dataModal.status == "A"?"true":"false";
      this.idData = this.getIdData();
      this.control.setDataToControls(this.containers,this.control.deleteValuesForSettings(this.dataModal,1,1));
      this.dataModal.dataModal.status = this.dataModal.dataModal.status == "true"?"A":"B";
      this.reactiveForm.setContainers(this.containers);
    });

  }

  getIdData(){
    let oData:{[k:string]:any}={};
    var key = this.dataModal?.keys[0];
    oData[key] = parseInt(this.dataModal?.dataModal[key],10);
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
    console.log(jsonResult);
    // const con_json = JSON.stringify(jsonResult);

     //cerrar el modal del formulario
     this.close();
    /*this.formCatService.updateRecord(jsonResult)
      .pipe(finalize(() => {  }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
            swal.fire({
              icon: 'success',
              title: 'Correcto  ',
              text: response.mensaje,
              heightAuto: false
            });
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
        if (err.status == 500 || err.status == 500) {
          swal.fire({
            icon: 'error',
            title: 'Lo sentimos',
            text: 'Por el momento no podemos proporcionar tu Solicitud.',
            heightAuto: false
          });
        }       
      });*/
  }



  close(){
    return(
      this.refData?.closeAll());
   }

   ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
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

}
