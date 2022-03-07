import { Component, Injector, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { Control } from '@app/core/models/capture/controls.model';
import swal from 'sweetalert2'
import { finalize } from 'rxjs/operators';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

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
  private showLoad: boolean = false;
  private loaderDuration: number;
  private objIds:any;
  
  constructor(private changeDetectorRef: ChangeDetectorRef,private injector:Injector,public refData?:MatDialogRef<UpdateModalAccountingComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.accountingService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
    this.messageError = new MessageErrorModule();
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.control.setDataToControls(this.containers,this.dataModal.dataModal);
    this.reactiveForm.setContainers(this.containers);
    this.objIds = {
      idSociedad: this.dataModal.dataModal.idSociedad,
      idTipoOperacion: this.dataModal.dataModal.idTipoOperacion,
      idSubTipoOperacion: this.dataModal.dataModal.idSubTipoOperacion,
      idReglaMonetizacion: this.dataModal.dataModal.idReglaMonetizacion
    }
  }

  update(){
    this.disabledFieldSociety(false);
    let cpyModal = this.reactiveForm.getDataForm(this.containers);
    cpyModal = {...cpyModal, ...this.objIds};
    cpyModal.contabilidadDiaria = cpyModal.contabilidadDiaria == true? 'true':'false';
    cpyModal.indicadorIVA = cpyModal.indicadorIVA == true? 'true':'false';
    this.control.setDataToControls(this.containers,cpyModal);
    this.reactiveForm.setContainers(this.containers);
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      this.disabledFieldSociety(true)
      this.reactiveForm.setContainers(this.containers);
      return;
    }
    let jsonResult = this.reactiveForm.getModifyContainers(this.containers);
    var oConta:Contabilidad =  new Contabilidad();
    oConta.idSociedad = jsonResult.idSociedad;
    oConta.idTipoOperacion = parseInt(jsonResult.idTipoOperacion,10);
    oConta.idSubtipoOperacion = parseInt(jsonResult.idSubTipoOperacion,10);
    oConta.idReglaMonetizacion = parseInt(this.objIds.idReglaMonetizacion,10);
    oConta.numeroApunte = parseInt(jsonResult.numeroApunte,10);
    oConta.sociedadGl = jsonResult.sociedadGl.trim();
    oConta.tipoCuenta = jsonResult.tipoCuenta.trim();
    oConta.cuentaSAP = jsonResult.cuentaSAP.trim();
    oConta.claseDocumento = jsonResult.claseDocumento.trim();
    oConta.concepto = jsonResult.concepto.trim();
    oConta.centroDestino = jsonResult.centroDestino.trim();
    oConta.contabilidadDiaria = jsonResult.contabilidadDiaria == "true"?"D":"C";
    oConta.indicadorIVA = jsonResult.indicadorIVA == "true"? "AA":"NA";
    oConta.indicadorOperacion = jsonResult.indicadorOperacion == '1' ? "C": "A";
    console.log(oConta);
    this.showLoader(true);
    this.accountingService.updateAccounting(oConta).pipe(finalize(() => { this.showLoader(false); }))
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
          if(result.isConfirmed){
            this.getDataTable();
          }
        });
      }
      else{
        this.messageError.showMessageError(response.message, response.code);
      }
    }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Por el momento no podemos proporcionar su Solicitud.',
          heightAuto: false
        });
      });
  }

  getDataTable(){
    let oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.accountingService.getInfoAccounting().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200:
          return(
            oResponse.status = true,
            oResponse.data = response.response,
            this.refData?.close(oResponse)
          );
          case 400: case 401: case 404:
          case 500:
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
      }, (err:any) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
          heightAuto: false
        });
      });
  }

  close(){
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

  disabledFieldSociety(disabled:boolean){
    let element:any; let ctrl:any;
    for(element of this.containers)
      for(ctrl of element.controls) 
        if(ctrl.ky === 'idSociedad'){
          ctrl.disabled = disabled;
        }
        else if(ctrl.ky === 'idTipoOperacion'){
          ctrl.disabled = disabled;
        }
        else if(ctrl.ky === 'idSubTipoOperacion'){
          ctrl.disabled = disabled;
        }
  }
}
