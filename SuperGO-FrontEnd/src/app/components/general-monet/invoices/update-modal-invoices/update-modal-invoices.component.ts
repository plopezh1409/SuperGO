import { Component, Inject, Injector, Injectable, OnInit,ChangeDetectorRef } from '@angular/core';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

//MATERIAL
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//SERVICES
import { FormInvoicesService } from '@app/core/services/invoices/formInvoices.service';

//MODELS
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import { InvoicesResponse } from '@app/core/models/ServiceResponseData/invoices-response.model';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';


@Component({
  selector: 'app-update-modal-invoices',
  templateUrl: './update-modal-invoices.component.html',
  styleUrls: ['./update-modal-invoices.component.sass']
})
@Injectable({providedIn: 'root'})

export class UpdateModalInvoicesComponent implements OnInit {
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private formInvService:FormInvoicesService;
  private messageError:MessageErrorModule;
  private loaderDuration: number;
  private objIds:any={};
  public reactiveForm:ReactiveForm;
  public containers:Container[];
  public alignContent='horizontal';
  public control:Control = new Control;
  public showLoad: boolean;

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
      idTipo: this.dataModal.dataModal.idTipo,
      idSubtipo: this.dataModal.dataModal.idSubtipo,
      idReglaMonetizacion: this.dataModal.dataModal.idReglaMonetizacion,
    };
  }

  update(){
    this.disabledFields(false);
    let cpyModal = this.reactiveForm.getDataForm(this.containers);
    cpyModal = {...cpyModal, ...this.objIds};
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    if(!this.reactiveForm.principalForm?.valid){
      this.messageError.showMessageErrorForm();
      this.restoreFields();
      return;
    }
    const dataContainer = this.reactiveForm.getModifyContainers(this.containers);
    this.restoreFields();
    const oInvoice:Facturas = new Facturas();
    oInvoice.idSociedad = parseInt(dataContainer.idSociedad,10);
    oInvoice.idSubtipo = parseInt(dataContainer.idSubtipo ,10);
    oInvoice.idTipo = parseInt(dataContainer.idTipo ,10);
    oInvoice.tipoComprobante = parseInt(dataContainer.tipoComprobante,10);
    oInvoice.tipoFactura = parseInt(dataContainer.tipoFactura,10);
    oInvoice.idReglaMonetizacion = this.objIds.idReglaMonetizacion;

    oInvoice.formaPago = dataContainer.formaPago;
    oInvoice.usoCFDI = dataContainer.usoCFDI;
    oInvoice.descripcionFactura = dataContainer.descripcionFactura.trim();
    oInvoice.claveServicio = dataContainer.claveServicio;
    oInvoice.metodoPago = dataContainer.metodoPago;

    this.showLoader(true);
    this.formInvService.updateInvoce(oInvoice).pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<GenericResponse>) => {
        if(response.code === this.codeResponse.RESPONSE_CODE_200){
          swal.fire({
            icon: 'success',
            title: 'Solicitud Correcta',
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
          this.messageError.showMessageError(response.message.toString() ,response.code);
        }
      }, (err) => {
        this.messageError.showMessageErrorLoadData();
      });
    }

  close(){
    const oResponse:ResponseTable= new ResponseTable();
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
    const oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.formInvService.getInfoInvoices().pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<InvoicesResponse>) => {
      if(response.code === this.codeResponse.RESPONSE_CODE_200){
        oResponse.status = true;
        oResponse.data = response.response.facturas;
        return(this.refData?.close(oResponse));
      }
      else{
        return(
          this.refData?.close(oResponse),
          this.messageError.showMessageErrorLoadData()
        );
      }
    }, (err) => {
        return(
          this.messageError.showMessageErrorLoadData()
          );
      });
  }

  disabledFields(disabled:boolean){
    this.containers.forEach((cont: Container) => {
      cont.controls.forEach((ctrl:Control) => {
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipo' || ctrl.ky === 'idSubtipo'){
          ctrl.disabled = disabled;
        }
      });
    });
  }

  restoreFields(){
    this.disabledFields(true);
    this.reactiveForm.setContainers(this.containers);
  }

}
