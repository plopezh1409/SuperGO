import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FigureTableComponent } from './figure-table/figure-table.component';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceNoMagicNumber, ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';

//COMPONENTS
import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';
import { FigureService } from '@app/core/services/figure/figure.service';
import { IncidentsTableComponent } from './incidents-table/incidents-table.component';
import { OperationalTableComponent } from './operational-table/operational-table.component';
import { DatosDeSalida, Tablero } from '@app/core/models/figure/figure.model';

@Component({
  selector: 'app-figure',
  templateUrl: './figure.component.html',
  styleUrls: ['./figure.component.sass']
})

export class FigureComponent implements OnInit {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  figureService:FigureService;
  reactiveForm:ReactiveForm;
  messageError:MessageErrorModule;
  containers:Container[];
  maxNumControls= Number(this.codeResponseMagic.RESPONSE_CODE_10);
  alignContent='horizontal';
  public dataInfo:DatosDeSalida[];
  public dataHeader:Tablero[];
  public showLoad: boolean;
  public idSolicitud : string | null;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();

  @ViewChild(FigureTableComponent) contentTable:FigureTableComponent;
  @ViewChild(IncidentsTableComponent) contentTable2:IncidentsTableComponent;
  @ViewChild(OperationalTableComponent) contentTable3:OperationalTableComponent;

  constructor(private readonly injector:Injector, private readonly appComponent: AppComponent,
    private readonly _route: ActivatedRoute) { 
    this.figureService = this.injector.get<FigureService>(FigureService);
    this.reactiveForm = new ReactiveForm();
    this.messageError = new MessageErrorModule();
    this.contentTable = new FigureTableComponent(this.injector,undefined);
    this.contentTable2 = new IncidentsTableComponent(this.injector,undefined);
    this.contentTable3 = new OperationalTableComponent(this.injector,undefined);
    
    this.containers=[];
    this.dataInfo=[];
    this.dataHeader=[];
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

  // onSubmit(value:{})
  // {
  //   if(!this.reactiveForm.principalForm?.valid){
  //     swal.fire({
  //       icon: 'warning',
  //       title: 'Campos requeridos',
  //       text: 'Complete los campos faltantes',
  //       heightAuto: false
  //     });
  //     return;
  //   }
  //   let dataForm;
  //   for(const datas of Object.values(value)){
  //     dataForm = Object(datas);
  //   }
  //   const oSociety:DatosDeSalida = new DatosDeSalida();
  //   oSociety.idTipo = parseInt(dataForm.idTipo,10);
  //   oSociety.razonSocial = dataForm.razonSocial.trim();
  //   oSociety.rfc = dataForm.rfc;
  //   this.appComponent.showLoader(true);
  //   this.societyService.insertSociety(oSociety).pipe(finalize(() => {
  //       this.appComponent.showLoader(false);
  //     })).subscribe((response:IResponseData<GenericResponse>) => {
  //       if(response.code === this.codeResponse.RESPONSE_CODE_201){
  //         this.reactiveForm.setContainers(this.containers);
  //         swal.fire({
  //           icon: 'success',
  //           title: 'Correcto  ',
  //           text: response.message.toString().toUpperCase(),
  //           heightAuto: false,
  //           confirmButtonText: 'Ok',
  //           allowOutsideClick: false
  //         }).then((result)=>{
  //           if(result.isConfirmed){
  //             this.reactiveForm.setContainers(this.containers);
  //             this.updateTable();
  //           }
  //         });
  //       }
  //       else{
  //         this.messageError.showMessageError(response.message.toString(), response.code);
  //       }
  //     }, (err) => {
  //         this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status);
  //     });
  // }

  async fillDataPage(){
    this.appComponent.showLoader(true);
    // const dataForm = await this.societyService.getForm({idRequest:this.idSolicitud}).toPromise().catch((err) =>{
    //   return err;
    // });
    const dataOper = await this.figureService.getInfoTablero().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);

    // if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code !== this.codeResponse.RESPONSE_CODE_200){
    //   this.messageError.showMessageError(dataForm.message, dataForm.code);
    // }
    // else if(dataForm.code !== this.codeResponse.RESPONSE_CODE_200 && dataOper.code === this.codeResponse.RESPONSE_CODE_200){
    //   this.dataInfo = dataOper.response.tableroOperativo;
    //   this.catalogsTable.onLoadTable(this.dataInfo);
    //   this.messageError.showMessageError(dataForm.message, dataForm.code);
    // }
    // else 
    if(dataOper.notificaciones[0].notificacion !== this.codeResponse.RESPONSE_CODE_MESSAGE_200) {
      // this.containers = dataForm.response.reactiveForm; 
      // this.reactiveForm.setContainers(this.containers);
      // localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      // this.containers = dataForm.response.reactiveForm; 
      this.dataInfo = dataOper.datosDeSalida.tableroOperativo;
      // this.dataHeader= [dataOper.datosDeSalida.operaciones];
      
      // this.reactiveForm.setContainers(this.containers);
      // localStorage.setItem('_auxForm',JSON.stringify(this.containers));
      this.contentTable.onLoadTable(this.dataInfo,this.dataHeader);
    }
  }

//   updateTable(){
//     this.appComponent.showLoader(true);
//     this.societyService.getInfoSocieties().pipe(finalize(() => {
//       this.appComponent.showLoader(false);
//     })).subscribe((response:IResponseData<SocietiesResponse>)=>{
//       switch (response.code) {
//         case this.codeResponse.RESPONSE_CODE_200:
//           this.dataInfo = response.response.sociedades;
//           this.catalogsTable.onLoadTable(this.dataInfo);
//         break;
//         case this.codeResponse.RESPONSE_CODE_400:
//         case this.codeResponse.RESPONSE_CODE_401:
//         case this.codeResponse.RESPONSE_CODE_404:
//         case this.codeResponse.RESPONSE_CODE_500:
//           swal.fire({
//             icon: 'error',
//             title: 'Error inesperado',
//             text: 'Ocurri?? un error al cargar los datos, intente mas tarde.',
//             heightAuto: false
//           });
//         break;
//         default:
//         break;
//       }
//     },(err) => {
//       swal.fire({
//         icon: 'error',
//         title: 'Error inesperado',
//         text: 'Ocurri?? un error al cargar la informacion, intente mas tarde.',
//         heightAuto: false
//       });
//     });
// }

}