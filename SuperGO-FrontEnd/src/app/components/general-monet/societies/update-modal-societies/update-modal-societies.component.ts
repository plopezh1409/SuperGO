import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//MODELS 
import { Control } from '@app/core/models/capture/controls.model';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Component({
  selector: 'app-update-modal-societies',
  templateUrl: './update-modal-societies.component.html',
  styleUrls: ['./update-modal-societies.component.sass']
})

export class UpdateModalSocietiesComponent implements OnInit {
  societyService:FormCatService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private showLoad: boolean;
  private loaderDuration: number;
  private idSociety:number;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();

  constructor(private readonly injector:Injector, public refData?:MatDialogRef<UpdateModalSocietiesComponent>,
      @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.societyService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.containers=[];
    this.loaderDuration = 100;
    this.showLoad = false;
    this.idSociety = 0;
  }
  

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.reactiveForm.setContainers(this.containers);
    this.idSociety = this.dataModal.dataModal.idSociedad;
    this.control.setDataToControls(this.containers, this.dataModal.dataModal);
    this.reactiveForm.setContainers(this.containers);
  }

  
  modify(){
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }
    let dataForm = this.reactiveForm.getModifyContainers(this.containers);
    let oSociety:Sociedad = new Sociedad();
    oSociety.idSociedad = this.idSociety;
    oSociety.idTipoSociedad = parseInt(dataForm.idTipoSociedad,10);
    oSociety.razonSocial = dataForm.razonSocial.trim();
    oSociety.RFC = dataForm.RFC;
    this.societyService.updateSociety(oSociety).pipe(finalize(() => {  }))
      .subscribe((response:any) => {
        if(response.code === this.codeResponse.RESPONSE_CODE_200){
          this.reactiveForm.setContainers(this.containers);
          swal.fire({
            icon: 'success',
            title: 'Solicitud correcta  ',
            text: response.mensaje,
            heightAuto: false,
            allowOutsideClick: false,
            confirmButtonText: 'Ok'
          }).then((result)=>{
            if(result.isConfirmed){
              this.getDataTable();
            }
          });
        }
        else{
          this.messageError.showMessageError(response.mensaje, response.code);
        }
      }, (err) => {
        this.messageError.showMessageError('Por el momento no podemos proporcionar tu Solicitud.', err.status);      
      });
  }

  getDataTable(){
    let oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.societyService.getInfoSocieties().pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response) => {
        switch(response.code){
          case this.codeResponse.RESPONSE_CODE_200:
            return(
              oResponse.status = true,
              oResponse.data = response.response.sociedades,
              this.refData?.close(oResponse)
            );
          case this.codeResponse.RESPONSE_CODE_400:
          case this.codeResponse.RESPONSE_CODE_401:
          case this.codeResponse.RESPONSE_CODE_404:
          case this.codeResponse.RESPONSE_CODE_500:
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
      }, (err) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
          heightAuto: false
        });
      });
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

  close(){
    return(
      this.refData?.close()
    );
  }
}
