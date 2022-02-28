import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import { DropdownModel } from '@app/core/models/dropdown/dropdown.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { SocietiesTableComponent } from './societies-table/societies-table.component';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-societies',
  templateUrl: './societies.component.html',
  styleUrls: ['./societies.component.sass']
})

export class societiescomponent implements OnInit {
  formCatService:FormCatService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Sociedad[];
  public showLoad: boolean = false;
  public idSolicitud : string | null;

  @ViewChild(SocietiesTableComponent) catalogsTable:SocietiesTableComponent;

  constructor(private injector:Injector, private appComponent: AppComponent,
    private readonly _route: ActivatedRoute) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
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
    //Validaciones form
    let bodySoc:Sociedad = new Sociedad();
    var newSociety;
    for(var datas of Object.values(value)){
      bodySoc = Object(datas);
    }
    console.log(bodySoc);
    // this.formCatService.getDataSociedad(bodySociety).//pipe(finalize(() => { this.appComponent.showLoader(false); })).
    // subscribe((data:any)=>{
    //   this.containers = data.response;      
    //   this.reactiveForm.setContainers(this.containers);
    // }, (err:any) => {
    //   if (err.status == 500 || err.status == 400) {
    //     swal.fire({
    //       icon: 'error',
    //       title: 'Lo sentimos',
    //       text: err.error.message,
    //       heightAuto: false
    //     });
    //   }       
    // });

    // //Borra el formulario
    this.reactiveForm.setContainers(this.containers);

    // var strCatalog = JSON.stringify(newSociety);
    /*this.formCatService.updateRecord(newSociety)
      .pipe(finalize(() => {  }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
            swal.fire({
              icon: 'success',
              title: 'Correcto  ',
              text: response.mensaje,
              heightAuto: false
            });
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
        if (err.status == 500 || err.status == 500) {
          swal.fire({
            icon: 'error',
            title: 'Lo sentimos',
            text: 'Por el momento no podemos proporcionar tu Solicitud.',
            heightAuto: false
          });
        }       
      });*/

    // this.formCatService.sendData(JSON.parse(strCatalog)).subscribe((data:any)=>{ });

    // let obj:Sociedad = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['SOCIEDADES'] as Sociedad;    
    // this.dataInfo.push(obj);
    // if(this.catalogsTable) { this.catalogsTable.onLoadTable(this.dataInfo); }
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.formCatService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    var dataOper = await this.formCatService.getInfoSocieties().toPromise().catch((err) =>{
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
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm,dataOper.response.tipoSociedad);
      this.dataInfo = dataOper. response;
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

  addDataDropdown(dataForm:any, dataContent:any){
    var dataDropdown:any = [];
    
    dataContent.forEach((element:any) => {
      var oDropdown:DropdownModel = new DropdownModel();
      Object.entries(element).forEach(([key, value]:any, idx:number) => {
        if(typeof value === 'number')
          oDropdown.ky = value;
        else
          oDropdown.value = value;
      });

      dataDropdown.push(oDropdown);
    });

    dataForm.forEach((element:any) => {
      element.controls.forEach((ctrl:any) => {
        if(ctrl.controlType === 'dropdown'){
          ctrl.content.contentList = dataDropdown;
          ctrl.content.options = dataDropdown;
        }
      });
    });
    return dataForm;
  }


}
