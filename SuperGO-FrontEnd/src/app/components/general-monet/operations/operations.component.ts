import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { OperationsTableComponent } from './operations-table/operations-table.component';

//SERVICES
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';

//MODELS
import { Container } from '@app/core/models/capture/container.model';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.sass']
})

export class OperationsComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Operaciones[];
  public channelCatalog:any[];

  @ViewChild(OperationsTableComponent) catalogsTable:OperationsTableComponent;

  constructor(private readonly appComponent: AppComponent, private injector:Injector) {
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new OperationsTableComponent();
    this.containers=[];
    this.dataInfo=[];
    this.channelCatalog=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
  }

  ngOnInit() {
    this.fillDataPage();
  }

  onSubmit(value:any)
  {
    if(!this.reactiveForm.principalForm?.valid){
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }

    let dataBody;
    for(var datas of Object.values(value)){
      dataBody = Object(datas);
    }
    var obOpe:Operaciones =  new Operaciones();
    obOpe.descripcionTipoOperacion = dataBody.descripcion
    obOpe.idCanal = dataBody.canal
    obOpe.topicoKafka = dataBody.topicoKafka
    obOpe.status = dataBody.estatus === true ?"A":"I"

    this.appComponent.showLoader(true);
    this.formCatService.insertOperation(obOpe).pipe(finalize(() => { this.appComponent.showLoader(false); }))
    .subscribe((data:any)=>{
      console.log(data);
      switch (data.code) {
        case 201: //Solicitud correcta
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.menssage,
          heightAuto: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false
        }).then((result)=>{
          if(result.isConfirmed){
            this.reactiveForm.setContainers(this.containers);
            this.updateTable();
          }
        });
          break;
        case 400: //Solicitud incorrecta
          swal.fire({
            icon: 'warning',
            title: 'Solicitud incorrecta',
            text: data.menssage,
            heightAuto: false
          });
          break;
        case 401://No autorizado
          swal.fire({
            icon: 'warning',
            title: 'No autorizado',
            text: data.menssage,
            heightAuto: false
          });
          break;
        case 500://Error Inesperado
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: data.menssage,
            heightAuto: false
          });
          break;
        default:
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: "Intente mas tarde",
            heightAuto: false
          });
          break;
        }
    });
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

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.formCatService.getForm().toPromise().catch((err) =>{
      return err;
    });
    var dataOper = await this.formCatService.getInfoOperation().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== 200){
      this.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== 200) {
      this.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response.canal);
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  showMessageError(menssage:string, code:number){
        switch (code) {
          case 400: //Solicitud incorrecta
            swal.fire({
              icon: 'warning',
              title: 'Solicitud incorrecta',
              text: menssage,
              heightAuto: false
            });
            break;
          case 404://No autorizado
            swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: menssage,
              heightAuto: false
            });
            break;
          case 500://Error Inesperado
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: menssage,
              heightAuto: false
            });
            break;
          default:
            break;
        }
      }

      updateTable(){
        this.appComponent.showLoader(true);
        this.formCatService.getInfoOperation().pipe(finalize(() => { this.appComponent.showLoader(false); })).
        subscribe((data:any)=>{
          switch (data.code) {
            case 200:
              this.dataInfo = data.response;
              this.catalogsTable.onLoadTable(this.dataInfo);
            break;
        case 400: //Solicitud incorrecta
        case 401:
        case 500:
        default:
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: "Ocurrió un error al cargar los datos, intente mas tarde.",
            heightAuto: false
          });
        break;
        }
    },(err:any) => {
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: "Ocurrió un error al cargar los datos, intente mas tarde.",
        heightAuto: false
      });      
    });
  }

}
