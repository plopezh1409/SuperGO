import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { SocietiesTableComponent } from './societies-table/societies-table.component';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-societies',
  templateUrl: './societies.component.html',
  styleUrls: ['./societies.component.sass']
})

export class societiescomponent implements OnInit {
  societyService:FormCatService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Sociedad[];
  public showLoad: boolean = false;
  public idSolicitud : string | null;

  @ViewChild(SocietiesTableComponent) catalogsTable:SocietiesTableComponent;

  constructor(private injector:Injector, private appComponent: AppComponent,
    private readonly _route: ActivatedRoute) { 
    this.societyService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.catalogsTable = new SocietiesTableComponent(this.injector);
    this.containers=[];
    this.dataInfo=[];
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
    let dataForm:any;
    for(var datas of Object.values(value)){
      dataForm = Object(datas);
    }
    let oSociety:Sociedad = new Sociedad();
    oSociety.idTipoSociedad = parseInt(dataForm.idTipoSociedad,10);
    oSociety.razonSocial = dataForm.razonSocial.trim();
    oSociety.RFC = dataForm.RFC;
    this.appComponent.showLoader(true);
    this.societyService.insertSociety(oSociety)
      .pipe(finalize(() => { this.appComponent.showLoader(false); }))
      .subscribe((response:any) => {
        if(response.code === 200){
          this.reactiveForm.setContainers(this.containers);
          swal.fire({
            icon: 'success',
            title: 'Correcto  ',
            text: response.mensaje,
            heightAuto: false,
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          }).then((result)=>{
            if(result.isConfirmed){
              this.reactiveForm.setContainers(this.containers);
              this.updateTable();
            }
          });
        }
        else{
          this.messageError.showMessageError(response.mensaje, response.code);
        }
      }, (err:any) => {
        if (err.status == 500 || err.status == 400)
          this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
      });
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.societyService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    var dataOper = await this.societyService.getInfoSocieties().toPromise().catch((err) =>{
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
      this.dataInfo = dataOper.response;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.societyService.getInfoSocieties().pipe(finalize(() => { this.appComponent.showLoader(false); })).
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
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
            heightAuto: false
          });
        break;
        default:
        break;
      }
    },(err:any) => {
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al cargar la informacion, intente mas tarde.',
        heightAuto: false
      });
    });
}

}