import { Component, Injector, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { AuthService } from '@app/core/services/sesion/auth.service';
import { Control } from '@app/core/models/capture/controls.model';
import swal from 'sweetalert2'
import { finalize } from 'rxjs/operators';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';

@Component({
  selector: 'app-update-modal-accounting',
  templateUrl: './update-modal-accounting.component.html',
  styleUrls: ['./update-modal-accounting.component.sass']
})

export class UpdateModalAccountingComponent implements OnInit {

  accountingService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;
  private idAccounting:any={};
  private showLoad: boolean = false;
  private loaderDuration: number;
  private authService:AuthService;
  
  constructor(private changeDetectorRef: ChangeDetectorRef,private injector:Injector,public refData?:MatDialogRef<UpdateModalAccountingComponent>, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.accountingService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.authService = this.injector.get<AuthService>(AuthService)
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.loaderDuration = 100;
  }

  ngOnInit(): void {
    this.containers = this.dataModal.auxForm;
    delete this.dataModal.auxForm;
    this.reactiveForm.setContainers(this.containers);
    this.idAccounting = this.getIdData();
    this.control.setDataToControls(this.containers,this.control.getValueForSettings(this.dataModal,1,1));
    this.reactiveForm.setContainers(this.containers);
  }

  update(){
    if(!this.authService.isAuthenticated())
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

    let jsonResult = this.reactiveForm.getModifyContainers(this.containers, this.idAccounting);
    var oConta:Contabilidad =  new Contabilidad();
    oConta.idSociedad = jsonResult.sociedad;
    oConta.idTipoOperacion = jsonResult.operacion;
    oConta.idSubtipoOperacion = jsonResult.subOperacion;
    oConta.idReglaMonetizacion = jsonResult.monetizacion;
    oConta.contabilidadDiaria = jsonResult.contabilidadDiaria == "true"?"D":"C";
    oConta.numeroApunte = jsonResult.numeroDeApunte;
    oConta.sociedad = jsonResult.sociedadGl;
    oConta.tipoCuenta = jsonResult.tipoCuenta;
    oConta.cuentaSAP = jsonResult.cuentaSap;
    oConta.claseDocumento = jsonResult.claseDeDocumento;
    oConta.concepto = jsonResult.concepto;
    oConta.centroDestino = jsonResult.centroDestino;
    oConta.indicadorIVA = jsonResult.IVA == "true"? "AA":"NA";
    oConta.indicadorOperacion = jsonResult.cargoAbono == "true" ? "C": "A";


    
    this.showLoader(true);
    this.accountingService.updateAccounting(oConta)
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

  getDataTable(){
    let oResponse:ResponseTable = new ResponseTable();
    this.showLoader(true);
    this.accountingService.getInfoAccounting().pipe(finalize(() => { this.showLoader(false); }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
          return(
            oResponse.status = true,
            oResponse.data = response.response,
            this.refData?.close(oResponse)
          );
          case 400:
          case 401:
          case 500:
          default:
            return(
              this.refData?.close(oResponse),
              swal.fire({
                icon: 'error',
                title:'Error',
                text: 'Ocurrio un error inesperado, intente más tarde.',
                heightAuto: false
              })
            );
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

  close(){
    return(
      this.refData?.close());
   }

   ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

   getIdData(){
    let oData:{[k:string]:any}={};
    var key = this.dataModal?.keys[0];
    oData[key] = parseInt(this.dataModal?.dataModal[key],10);
    return oData;
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
      console.log('showload', this.showLoad);
    }, this.loaderDuration);
  }


}
