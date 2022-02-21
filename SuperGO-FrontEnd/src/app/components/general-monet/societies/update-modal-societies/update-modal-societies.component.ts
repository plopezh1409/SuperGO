import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { element } from 'protractor';
import { FormGroup } from '@angular/forms';
import { FormService } from '@app/core/services/capture/form.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';


//MODELS 
import { Control } from '@app/core/models/capture/controls.model';
import { AuthService } from '@app/core/services/sesion/auth.service';

@Component({
  selector: 'app-update-modal-societies',
  templateUrl: './update-modal-societies.component.html',
  styleUrls: ['./update-modal-societies.component.sass']
})

export class UpdateModalSocietiesComponent implements OnInit {
  formCatService:FormCatService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private showLoad: boolean = false;
  private loaderDuration: number;
  private authService:AuthService;
  private idSociety:any;

  constructor(private injector:Injector,public refData?:MatDialogRef<UpdateModalSocietiesComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.authService = this.injector.get<AuthService>(AuthService)
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
  }
  

  ngOnInit(): void {
    this.refData?.updateSize('70%');
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.reactiveForm.setContainers(this.containers);
    this.idSociety = this.dataModal.dataModal.idSociedad;
    // this.control.setDataToControls(this.containers,this.control.deleteValuesForSettings(this.dataModal,1,1));
    this.control.setDataToControls(this.containers, this.dataModal.dataModal);
    this.reactiveForm.setContainers(this.containers);
  }

  
  modify(){
    // let jsonResult = this.reactiveForm.getModifyContainers(this.containers);
    let oSociety:Sociedad = this.reactiveForm.getModifyContainers(this.containers);
    oSociety.idSociedad = this.idSociety;
    console.log(oSociety);
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
      this.refData?.close()
    );
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
