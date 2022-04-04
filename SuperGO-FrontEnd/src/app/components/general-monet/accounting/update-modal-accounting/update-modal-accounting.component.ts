import { Component, Injector, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { Control } from '@app/core/models/capture/controls.model';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { AccountingResponse } from '@app/core/models/ServiceResponseData/accounting-response.model';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import moment from 'moment';

@Component({
  selector: 'app-update-modal-accounting',
  templateUrl: './update-modal-accounting.component.html',
  styleUrls: ['./update-modal-accounting.component.sass']
})

export class UpdateModalAccountingComponent implements OnInit {

  accountingService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  messageError: MessageErrorModule;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  public showLoad: boolean;
  private readonly loaderDuration: number;
  private objIds:{};
  idReglaMonetizacion:number;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();

  
  constructor(private readonly changeDetectorRef: ChangeDetectorRef,private readonly injector:Injector,
      public refData?:MatDialogRef<UpdateModalAccountingComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.accountingService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
    this.messageError = new MessageErrorModule();
    this.showLoad = false;
    this.objIds = {};
    this.idReglaMonetizacion = 0;
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.control.setDataToControls(this.containers,this.dataModal.dataModal);
    this.reactiveForm.setContainers(this.containers);
    this.idReglaMonetizacion = parseInt(this.dataModal.dataModal.idReglaMonetizacion,10);
    this.objIds = {
      idSociedad: this.dataModal.dataModal.idSociedad,
      idTipoOperacion: this.dataModal.dataModal.idTipoOperacion,
      idSubTipoOperacion: this.dataModal.dataModal.idSubTipoOperacion,
      idReglaMonetizacion: this.dataModal.dataModal.idReglaMonetizacion,
    };
  }

  update(){
    this.disabledFields(false);
    let cpyModal = this.reactiveForm.getDataForm(this.containers);
    cpyModal = {...cpyModal, ...this.objIds};
    cpyModal.contabilidadDiaria = cpyModal.contabilidadDiaria === true? 'true':'false';
    cpyModal.indicadorIVA = cpyModal.indicadorIVA === true? 'true':'false';
    cpyModal.indicadorOperacion = cpyModal.indicadorOperacion === '1'? 'C' : 'A';
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
    const jsonResult = this.reactiveForm.getModifyContainers(this.containers);
    const oConta:Contabilidad =  new Contabilidad();
    oConta.idSociedad = jsonResult.idSociedad;
    oConta.idTipo = parseInt(jsonResult.idTipo,10);
    oConta.idSubtipo = parseInt(jsonResult.idSubtipo,10);
    oConta.idReglaMonetizacion = this.idReglaMonetizacion;
    oConta.numeroApunte = parseInt(jsonResult.numeroApunte,10);
    oConta.sociedadGl = jsonResult.sociedadGl.trim();
    oConta.tipoCuenta = jsonResult.tipoCuenta.trim();
    oConta.cuentaSAP = jsonResult.cuentaSAP.trim();
    oConta.claseDocumento = jsonResult.claseDocumento.trim();
    oConta.concepto = jsonResult.concepto.trim();
    oConta.centroDestino = jsonResult.centroDestino.trim();
    oConta.contabilidadDiaria = jsonResult.contabilidadDiaria === 'true'?'D':'C';
    oConta.indicadorIVA = jsonResult.indicadorIVA === 'true'? 'AA':'NA';
    oConta.indicadorOperacion = jsonResult.indicadorOperacion === '1' ? 'C': 'A';
    oConta.idReglaMonetizacion = jsonResult.idReglaMonetizacion;
    this.showLoader(true);
    this.accountingService.updateAccounting(oConta).pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<GenericResponse>) => {
      if(response.code === this.codeResponse.RESPONSE_CODE_200){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: response.message.toString(),
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
        swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Por el momento no podemos proporcionar su Solicitud.',
          heightAuto: false
        });
      });
  }

  getDataTable(){
    const oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.accountingService.getInfoAccounting().pipe(finalize(() => {
      this.showLoader(false);
    })).subscribe((response:IResponseData<AccountingResponse>) => {
        switch (response.code) {
          case this.codeResponse.RESPONSE_CODE_200:
            oResponse.status = true;
            oResponse.data = this.orderDate(response.response.contabilidad);
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
                title: 'Error',
                text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
                heightAuto: false
              })
            );
            default: break;
        }
      },() => {
        return(
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
          heightAuto: false
        }));
      });
  }

  orderDate(contabilidad:Contabilidad[]){
    contabilidad.forEach(oData => {
      oData.fechaInicio = moment(oData.fechaInicio).format('DD/MM/YYYY');
      oData.fechaFin = moment(oData.fechaFin).format('DD/MM/YYYY');
    });
    return contabilidad;
  }

  
  close(): void | undefined{
    return(
      this.refData?.close());
   }

   ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
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
