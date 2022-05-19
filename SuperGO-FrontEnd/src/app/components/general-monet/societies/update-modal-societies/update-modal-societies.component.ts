import { Component, Inject, Injector, OnInit, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import { SocietiesResponse } from '@app/core/models/ServiceResponseData/societies-response.model';

@Component({
  selector: 'app-update-modal-societies',
  templateUrl: './update-modal-societies.component.html',
  styleUrls: ['./update-modal-societies.component.sass']
})
@Injectable({providedIn: 'root'})

export class UpdateModalSocietiesComponent implements OnInit {
  societyService:FormCatService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  public showLoad: boolean;
  private readonly loaderDuration: number;
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
    const dataForm = this.reactiveForm.getModifyContainers(this.containers);
    const oSociety:Sociedad = new Sociedad();
    oSociety.idSociedad = this.idSociety;
    oSociety.idTipo = parseInt(dataForm.idTipo,10);
    oSociety.razonSocial = dataForm.razonSocial.trim();
    oSociety.rfc = dataForm.rfc;
    this.showLoader(true);
    this.societyService.updateSociety(oSociety).pipe(finalize(() => {
      this.showLoader(false);
      })).subscribe((response:IResponseData<GenericResponse>) => {
        if(response.code === this.codeResponse.RESPONSE_CODE_200){
          this.reactiveForm.setContainers(this.containers);
          swal.fire({
            icon: 'success',
            title: 'Solicitud Correcta  ',
            text: response.message.toString().toUpperCase(),
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
          this.messageError.showMessageError(response.message.toString(), response.code);
        }
      }, (err) => {
        this.messageError.showMessageError('Por el momento no podemos proporcionar tu Solicitud.', err.status);      
      });
  }

  getDataTable(){
    const oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.societyService.getInfoSocieties().pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<SocietiesResponse>) => {
        switch(response.code){
          case this.codeResponse.RESPONSE_CODE_200:
            oResponse.status = true;
            oResponse.data = response.response.sociedades;
            return(
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
        return(
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
          heightAuto: false
        })
        );
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
