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
import { AuthService } from '@app/core/services/sesion/auth.service';


@Component({
  selector: 'app-societies',
  templateUrl: './societies.component.html',
  styleUrls: ['./societies.component.sass']
})

export class SocietiesComponent implements OnInit {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private authService: AuthService;
  private societyService:FormCatService;
  private idSolicitud : string | null;
  private messageError:MessageErrorModule;
  private dataInfo:Sociedad[];
  public reactiveForm:ReactiveForm;
  public containers:Container[];
  public maxNumControls= Number(this.codeResponseMagic.RESPONSE_CODE_10);
  public alignContent='horizontal';
  public showLoad: boolean;

  @ViewChild(SocietiesTableComponent) catalogsTable:SocietiesTableComponent;

  constructor(private readonly injector:Injector, private readonly appComponent: AppComponent,
    private readonly _route: ActivatedRoute) {
    this.societyService = this.injector.get<FormCatService>(FormCatService);
    this.authService = this.injector.get<AuthService>(AuthService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.catalogsTable = new SocietiesTableComponent(this.injector);
    this.containers=[];
    this.dataInfo=[];
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
      this.messageError.showMessageErrorForm();
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
          this.messageError.showMessageErrorRequest();
      });
  }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    const dataForm = await this.societyService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
      return err;
    });
    if(!this.authService.isAuthenticated()){
      this.appComponent.showLoader(false);
      return;
    }
    const dataOper:IResponseData<SocietiesResponse> = await this.societyService.getInfoSocieties().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code !== this.codeResponse.RESPONSE_CODE_200){
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code === this.codeResponse.RESPONSE_CODE_200){
      this.dataInfo = dataOper.response.sociedades;
      this.catalogsTable.onLoadTable(this.dataInfo);
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataOper.code !== this.codeResponse.RESPONSE_CODE_200 && dataForm.code === this.codeResponse.RESPONSE_CODE_200) {
      this.containers = dataForm.response.reactiveForm;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.containers = dataForm.response.reactiveForm;
      this.dataInfo = dataOper.response.sociedades;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.societyService.getInfoSocieties().pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((response:IResponseData<SocietiesResponse>)=>{
      if(response.code === this.codeResponse.RESPONSE_CODE_200){
        this.dataInfo = response.response.sociedades;
        this.catalogsTable.onLoadTable(this.dataInfo);
      }
      else{
        this.messageError.showMessageErrorLoadData();
      }
    },(err) => {
      this.messageError.showMessageErrorLoadData();
    });
}

}
