import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';
import { OperationsTableComponent } from './operations-table/operations-table.component';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

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

  async ngOnInit() {
    console.log("GeneralComponent ngOnInit");
    let dataForm = await this.formCatService.getForm().pipe(finalize(() => { this.appComponent.showLoader(false); })).toPromise();
    var dataOper = await this.formCatService.getData().toPromise();
    
    if(dataForm.code !== 200){
      this.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== 200) {
      this.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response.canales);
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
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
    this.formCatService.insertOperation(dataBody).pipe(finalize(() => { this.appComponent.showLoader(false); })).
    subscribe((data:any)=>{
      
    });

    
    // //Borra el formulario
    this.reactiveForm.setContainers(this.containers);


    // let obj:Operaciones = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['OPERACIONES'] as Operaciones;
    // this.dataInfo.push(obj);
    // if(this.catalogsTable)
    // {
    //   this.catalogsTable.onLoadTable(this.dataInfo);
    // }
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
          case 401://No autorizado
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
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: "Intente mas tarde",
              heightAuto: false
            });
            break;
        }
  }
}
