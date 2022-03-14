import { Component, Inject, Injector, OnInit,ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormInvoicesService } from '@app/core/services/invoices/formInvoices.service';
import swal from 'sweetalert2';
import { Facturas } from '@app/core/models/facturas/facturas.model'
import { finalize } from 'rxjs/operators';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

@Component({
  selector: 'app-update-modal-invoices',
  templateUrl: './update-modal-invoices.component.html',
  styleUrls: ['./update-modal-invoices.component.sass']
})

export class UpdateModalInvoicesComponent implements OnInit {

  formInvService:FormInvoicesService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  public formas:any;
  public showLoad: boolean;
  private loaderDuration: number;
  private objIds:any;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  
  constructor(private readonly changeDetectorRef: ChangeDetectorRef, private readonly injector:Injector,
      public refData?:MatDialogRef<UpdateModalInvoicesComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formInvService = this.injector.get<FormInvoicesService>(FormInvoicesService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.containers=[];
    this.loaderDuration = 100;
    this.showLoad = false;
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.control.setDataToControls(this.containers, this.dataModal.dataModal);
    this.reactiveForm.setContainers(this.containers);
    this.objIds = {
      idSociedad: this.dataModal.dataModal.idSociedad,
      idTipoOperacion: this.dataModal.dataModal.idTipoOperacion,
      idSubTipoOperacion: this.dataModal.dataModal.idSubTipoOperacion,
      idReglaMonetizacion: this.dataModal.dataModal.idReglaMonetizacion
    }
  }

  update(){
    this.disabledFields(false);
    let cpyModal = this.reactiveForm.getDataForm(this.containers);
    cpyModal = {...cpyModal, ...this.objIds};
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      this.disabledFields(true);
      this.reactiveForm.setContainers(this.containers);
      return;
    }
    let oInvoice:Facturas = this.reactiveForm.getModifyContainers(this.containers);
    oInvoice.idReglaMonetizacion = this.objIds.idReglaMonetizacion;
    this.showLoader(true);
    this.formInvService.updateInvoce(oInvoice).pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:any) => {
        if(response.code === this.codeResponse.RESPONSE_CODE_200){
          swal.fire({
            icon: 'success',
            title: 'Solicitud correcta',
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
          this.messageError.showMessageError(response.message ,response.code)
        }
      }, (err) => {
        this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
      });
  }

  close(){
    let oResponse:ResponseTable= new ResponseTable();
    return(this.refData?.close(oResponse));
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
    this.formInvService.getInfoInvoices().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case this.codeResponse.RESPONSE_CODE_200:
            oResponse.status = true;
            oResponse.data = response.response;
            return(this.refData?.close(oResponse));
          case this.codeResponse.RESPONSE_CODE_400:
          case this.codeResponse.RESPONSE_CODE_401:
          case this.codeResponse.RESPONSE_CODE_404:
          case this.codeResponse.RESPONSE_CODE_500:
            return(
              this.refData?.close(oResponse),
              swal.fire({
                icon: 'error',
                title:'Error',
                text: 'Ocurrio un error inesperado, intente más tarde.',
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
          text: 'Ocurrio un error inesperado, intente más tarde.',
          heightAuto: false
        });
      });
  }

  disabledFields(disabled:boolean){
    this.containers.forEach((cont: Container) => {
      cont.controls.forEach((ctrl:Control) => {
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipoOperacion' || ctrl.ky === 'idSubTipoOperacion'){
          ctrl.disabled = disabled;
        }
      });
    });
  }

}