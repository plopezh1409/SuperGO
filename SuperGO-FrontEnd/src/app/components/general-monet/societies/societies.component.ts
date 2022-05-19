import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { SocietiesTableComponent } from './societies-table/societies-table.component';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceNoMagicNumber, ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { GenericResponse } from '@app/core/models/ServiceResponseData/generic-response.model';
import { SocietiesResponse } from '@app/core/models/ServiceResponseData/societies-response.model';
import { Control } from '@app/core/models/capture/controls.model';
import { DropdownFunctionality } from '@app/shared/dropdown/dropdown-functionality';
import { DropdownModel } from '@app/core/models/dropdown/dropdown.model';
import { DropdownEvent } from '@app/core/models/capture/dropdown-event.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-societies',
  templateUrl: './societies.component.html',
  styleUrls: ['./societies.component.sass']
})

export class SocietiesComponent implements OnInit {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  societyService:FormCatService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls= Number(this.codeResponseMagic.RESPONSE_CODE_10);
  alignContent='horizontal';
  sociedadesSap: Sociedad[];
  control: Control = new Control;
  public dataInfo:Sociedad[];
  public showLoad: boolean;
  public idSolicitud : string | null;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly dropDownFunc: DropdownFunctionality;

  @ViewChild(SocietiesTableComponent) catalogsTable:SocietiesTableComponent;

  constructor(private readonly injector:Injector, private readonly appComponent: AppComponent,
    private readonly _route: ActivatedRoute) { 
    this.societyService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.catalogsTable = new SocietiesTableComponent(this.injector);
    this.dropDownFunc = new DropdownFunctionality();
    this.containers=[];
    this.dataInfo=[];
    this.sociedadesSap=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.idSolicitud=null;
    this.showLoad = false;
  }
  
  ngOnInit() {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null){
      this.fillDataPage();
    }
  }

  onSubmit(value:{})
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
    let dataForm;
    for(const datas of Object.values(value)){
      dataForm = Object(datas);
    }
    const oSociety:Sociedad = new Sociedad();
    oSociety.idTipo = parseInt(dataForm.idTipo,10);
    oSociety.razonSocial = dataForm.razonSocial.trim();
    oSociety.rfc = dataForm.rfc;
    this.appComponent.showLoader(true);
    this.societyService.insertSociety(oSociety).pipe(finalize(() => {
        this.appComponent.showLoader(false);
      })).subscribe((response:IResponseData<GenericResponse>) => {
        if(response.code === this.codeResponse.RESPONSE_CODE_201){
          this.reactiveForm.setContainers(this.containers);
          swal.fire({
            icon: 'success',
            title: 'Correcto  ',
            text: response.message.toString().toUpperCase(),
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
          this.messageError.showMessageError(response.message.toString(), response.code);
        }
      }, (err) => {
          this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
      });
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    const dataForm = await this.societyService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    const dataOper:IResponseData<SocietiesResponse> = await this.societyService.getInfoSocieties().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== this.codeResponse.RESPONSE_CODE_200) {
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = dataForm.response.reactiveForm; //this.addDataDropdown(dataForm.response.reactiveForm, dataOper.response);
      //this.disabledFields(true);
      this.dataInfo = dataOper.response.sociedades;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  addDataDropdown(dataForm:Container[], dataContent:SocietiesResponse){
    let cpDataContent:any = Object.assign({},dataContent);
    this.sociedadesSap = cpDataContent.sociedadesSAP;
    delete cpDataContent.sociedades;
    delete cpDataContent.sociedadesSAP;
    cpDataContent = this.dropDownFunc.createValues(cpDataContent);
    let arrDropdown: DropdownModel[] = [];
    this.sociedadesSap.forEach((x:Sociedad) => {
      let oDropdown: DropdownModel = new DropdownModel();
      oDropdown.ky = x.idSociedad;
      oDropdown.value = x.razonSocial;
      arrDropdown.push(oDropdown);
    });
    cpDataContent.sociedadesSAP = arrDropdown;
    dataForm.forEach((element:Container) => {
      element.controls.forEach((ctrl:Control) => {
        if(ctrl.content && (ctrl.controlType === 'dropdown' ||  ctrl.controlType === 'autocomplete')){
          if(ctrl.ky === 'razonSocial' ){
            ctrl.content.contentList = cpDataContent.sociedadesSAP;
            ctrl.content.options = cpDataContent.sociedadesSAP;
          }else if(ctrl.ky === 'idTipo'){
            ctrl.content.contentList = cpDataContent.tipoSociedades;
            ctrl.content.options = cpDataContent.tipoSociedades;
          }
          else{
            
          }
        }
      });
    });
    return dataForm;
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.societyService.getInfoSocieties().pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((response:IResponseData<SocietiesResponse>)=>{
      switch (response.code) {
        case this.codeResponse.RESPONSE_CODE_200:
          this.dataInfo = response.response.sociedades;
          this.catalogsTable.onLoadTable(this.dataInfo);
        break;
        case this.codeResponse.RESPONSE_CODE_400:
        case this.codeResponse.RESPONSE_CODE_401:
        case this.codeResponse.RESPONSE_CODE_404:
        case this.codeResponse.RESPONSE_CODE_500:
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
    },(err) => {
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al cargar la informacion, intente mas tarde.',
        heightAuto: false
      });
    });
}

onSelectionChanged($event: any){
  if($event.control.ky !== 'razonSocial') {
    return;
  }
  let dataContainer = this.reactiveForm.getDataForm(this.containers);
  const [oSap] = this.sociedadesSap.filter(x => x.idSociedad === dataContainer.razonSocial.ky);
  oSap.razonSocial = dataContainer.razonSocial;
  this.control.setDataToControls(this.containers, oSap);
  this.reactiveForm.setContainers(this.containers);
}

disabledFields(disabled:boolean){
  this.containers.forEach((cont: Container) => {
    cont.controls.forEach((ctrl:Control) => {
      if(ctrl.ky === 'rfc'){
        ctrl.disabled = disabled;
      }
    });
  });
}

}