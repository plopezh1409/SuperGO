import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { OperationsTableComponent } from './operations-table/operations-table.component';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

//SERVICES
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';

//MODELS
import { Container } from '@app/core/models/capture/container.model';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.sass']
})

export class OperationsComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Operaciones[];
  public channelCatalog:any[];
  public idSolicitud: string | null;

  @ViewChild(OperationsTableComponent) catalogsTable:OperationsTableComponent;

  constructor(private readonly appComponent: AppComponent, private injector:Injector,
    private readonly _route: ActivatedRoute) {
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.catalogsTable = new OperationsTableComponent();
    this.containers=[];
    this.dataInfo=[];
    this.channelCatalog=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.idSolicitud=null;
  }

  ngOnInit() {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null)
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
    obOpe.descripcionTipoOperacion = dataBody.descripcionTipoOperacion;
    obOpe.idCanal = dataBody.idCanal;
    obOpe.topicoKafka = dataBody.topicoKafka;
    obOpe.status = dataBody.status === true ?"A":"I";
    this.appComponent.showLoader(true);
    this.formCatService.insertOperation(obOpe).pipe(finalize(() => { this.appComponent.showLoader(false); }))
    .subscribe((data:any)=>{
      if(data.code == 201){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.message,
          heightAuto: false,
          confirmButtonText: "Ok",
          allowOutsideClick: false
        }).then((result)=>{
          if(result.isConfirmed){
            this.reactiveForm.setContainers(this.containers);
            this.updateTable();
          }
        });
      }
      else{
        this.messageError.showMessageError(data.message, data.code);
      }
    },(err:any) => {
      this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
    });
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.formCatService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    var dataOper = await this.formCatService.getInfoOperation().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== 200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== 200) {
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = dataForm.response.reactiveForm;
      console.log(this.containers);
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
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
        case 400:
        case 401:
        case 404:
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