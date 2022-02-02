import { Component, Inject, Injector, OnInit,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormInvoicesService } from '@app/core/services/invoices/formInvoices.service';
import swal from 'sweetalert2';
import { AuthService } from '@app/core/services/sesion/auth.service';
import { Facturas } from '@app/core/models/facturas/facturas.model'
import { finalize } from 'rxjs/operators';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';

@Component({
  selector: 'app-update-modal-invoices',
  templateUrl: './update-modal-invoices.component.html',
  styleUrls: ['./update-modal-invoices.component.sass']
})

export class UpdateModalInvoicesComponent implements OnInit {

  formInvService:FormInvoicesService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  public formas:any;
  idInvoice:any;
  public showLoad: boolean = false;
  private loaderDuration: number;
  private authService:AuthService;
  
  constructor(private changeDetectorRef: ChangeDetectorRef, private injector:Injector,public refData?:MatDialogRef<UpdateModalInvoicesComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formInvService = this.injector.get<FormInvoicesService>(FormInvoicesService);
    this.authService = this.injector.get<AuthService>(AuthService);
    this.reactiveForm = new ReactiveForm();
    this.refData?.updateSize('70%');
    this.containers=[];
    this.loaderDuration = 100;
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.reactiveForm.setContainers(this.containers);
    this.idInvoice = this.getIdInvoice();
    this.control.setDataToControls(this.containers,this.control.getValueForSettings(this.dataModal,1,1));
    this.reactiveForm.setContainers(this.containers);
    // this.formCatService.getForm().subscribe((data:any)=>{
    //   this.containers = data.response;
    //   this.reactiveForm.setContainers(this.containers);
    //   this.control.setDataToControls(this.containers,this.control.deleteValuesForSettings(this.dataModal,1,1));
    //   this.reactiveForm.setContainers(this.containers);
    // });

  }

  getIdInvoice(){
    let oData:{[k:string]:any}={};
    var key = this.dataModal?.keys[0];
    oData[key] = parseInt(this.dataModal?.dataModal[key]);
    return oData;
  }

  update(){
    if(this.authService.isAuthenticated())
      this.close();
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }

    let jsonResult = this.reactiveForm.getModifyContainers(this.containers, this.idInvoice);
    var oInvoice:Facturas =  new Facturas();
    oInvoice.idSociedad = jsonResult.sociedad;
    oInvoice.idTipoOperacion = jsonResult.operacion;
    oInvoice.idSubTipoOperacion = jsonResult.subOperacion;
    oInvoice.tipoComprobante = jsonResult.tipoDeComprobante;
    oInvoice.tipoFactura = jsonResult.tipoDeFactura;

    this.showLoader(true);
    this.formInvService.updateInvoce(oInvoice)
      .pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        console.log(response.code)
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
    this.formInvService.getInfoInvoices().pipe(finalize(() => { this.showLoader(false); }))
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
