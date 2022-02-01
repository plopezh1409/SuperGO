import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { element } from 'protractor';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';
import { FormService } from '@app/core/services/capture/form.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-update-modal-catalogs',
  templateUrl: './update-modal-catalogs.component.html',
  styleUrls: ['./update-modal-catalogs.component.sass']
})

export class UpdateModalCatalogsComponent implements OnInit {
  formCatService:FormCatService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  private idData:any={};

  public control:Control = new Control;

  constructor(private injector:Injector,public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
  }
  

  ngOnInit(): void {
    // this.formCatService.getForm().subscribe((data:any)=>{
    //   this.containers = data.response;
    //   this.reactiveForm.setContainers(this.containers);
    //   this.idData = this.getIdData();
    //   this.control.setDataToControls(this.containers,this.control.deleteValuesForSettings(this.dataModal,1,1));
    //   this.reactiveForm.setContainers(this.containers);
    // });
  }

  
  modify(){
    let jsonResult = this.reactiveForm.getModifyContainers(this.containers, this.idData);
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


  close(){ return(
   this.refData?.closeAll());
  }

  getIdData(){
    let oData:{[k:string]:any}={};
    var key = this.dataModal?.keys[0];
    oData[key] = parseInt(this.dataModal?.dataModal[key],10);
    return oData;
  }

}
