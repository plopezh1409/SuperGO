import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { MonetizationTableComponent } from './monetization-table/monetization-table.component';
import { FormGroup } from '@angular/forms';
import swal from 'sweetalert2';

//MODELS
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { Control } from '@app/core/models/capture/controls.model';

//SERVICES
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';
import { ActivatedRoute } from '@angular/router';

import { PeriodicityModule } from './helper/periodicity/periodicity.module';
import { MonetizationModule } from './helper/monetization/monetization.module';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { finalize } from 'rxjs/operators';
import { ServiceNoMagicNumber, ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';


@Component({
  selector: 'app-monetization',
  templateUrl: './monetization.component.html',
  styleUrls: ['./monetization.component.sass']
})

export class MonetizationComponent implements OnInit {
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  monetService: FormMonetizationsService;
  messageError: MessageErrorModule;
  reactiveForm: ReactiveForm;
  containers: Container[];
  maxNumControls: number;
  alignContent = 'horizontal';
  public dataInfo: Monetizacion[];
  public showButtonAdd: boolean;
  private selectedValRequest: any;
  public principalContainers: Container[];
  public idSolicitud: string | null;
  private periodicity: PeriodicityModule;
  private monetModule: MonetizationModule;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();

  @ViewChild(MonetizationTableComponent) catalogsTable: MonetizationTableComponent;

  constructor(private readonly appComponent: AppComponent, private injector: Injector,
    private readonly _route: ActivatedRoute) {
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.messageError = new MessageErrorModule();
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new MonetizationTableComponent(this.injector);
    this.containers = [];
    this.dataInfo = [];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.showButtonAdd = false;
    this.selectedValRequest = null;
    this.principalContainers = [];
    this.idSolicitud = null;
    this.maxNumControls = 10;
    this.periodicity = new PeriodicityModule();
    this.monetModule = new MonetizationModule();
  }

  ngOnInit(): void {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if (this.idSolicitud != null){
      this.fillDataPage();
    }
  }

  onSubmit(oElement: any) {
    let dataForm;
    for (const datas of Object.values(oElement)) {
      dataForm = Object(datas);
    }
    if (!this.reactiveForm.principalForm?.valid || dataForm.codigoDivisa === '') {
      swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Complete los campos faltantes',
        heightAuto: false
      });
      return;
    }
    if ((Date.parse(dataForm.fechaInicioVigencia) + 1) > Date.parse(dataForm.fechaFinVigencia)) {
      swal.fire({
        icon: 'warning',
        title: 'Fechas de Vigencia',
        text: 'Seleccione un rango de fechas de validas.',
        heightAuto: false
      });
      return;
    }
    const oMonet: Monetizacion = new Monetizacion();
    oMonet.idSociedad = dataForm.idSociedad;
    oMonet.idTipoOperacion = parseInt(dataForm.idTipoOperacion,10);
    oMonet.idSubTipoOperacion = parseInt(dataForm.idSubTipoOperacion,10);
    oMonet.segmento = parseInt(dataForm.segmento, 10);
    oMonet.tipoMontoMonetizacion = this.monetModule.getTypeOfMonetization(dataForm.tipoMontoMonetizacion, this.containers);
    oMonet.montoMonetizacion = parseFloat(dataForm.montoMonetizacion);
    oMonet.idTipoImpuesto = parseInt(dataForm.idTipoImpuesto, 10);
    oMonet.codigoDivisa = this.monetModule.getDivisa(dataForm.codigoDivisa.value);
    oMonet.emisionFactura = dataForm.emisionFactura;
    oMonet.indicadorOperacion = dataForm.indicadorOperacion === true ? 'P' : 'C';
    oMonet.periodicidadCorte = this.periodicity.getPeriodicity_insert(dataForm, this.getDay(dataForm.nombreDia));
    oMonet.fechaInicioVigencia = this.getDateTime(dataForm.fechaInicioVigencia);
    oMonet.fechaFinVigencia = this.getDateTime(dataForm.fechaFinVigencia);
    this.appComponent.showLoader(true);
    this.monetService.insertMonetization(oMonet).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data:any)=>{
      if(data.code === this.codeResponse.RESPONSE_CODE_201){
        swal.fire({
          icon: 'success',
          title: 'Solicitud correcta',
          text: data.menssage,
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
        this.messageError.showMessageError(data.message, data.code);
      }
    });
  }

  getDateTime(date: string) {
    const dateTime: Date = new Date(date);
    date = `${dateTime.getDate().toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')} - ${(dateTime.getMonth() + 1).toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')}
      - ${dateTime.getFullYear()}`;
    return date;
  }

  getDay(type: string) {
    const dataForm = this.containers;
    let typeMonet = '';
    dataForm.forEach((element: Container) => {
      element.controls.forEach((ctrl: Control) => {
        if (ctrl.controlType === 'dropdown' && ctrl.ky === 'nombreDia' && ctrl.content) {
          for (const data of ctrl.content.contentList) {
            if (data.ky === type) {
              typeMonet = data.value;
              break;
            }
          }
        }
      });
    });
    return typeMonet;
  }

  async fillDataPage() {
    this.appComponent.showLoader(true);
    const dataForm = await this.monetService.getForm({ idRequest: this.idSolicitud }).toPromise().catch((err) => {
      return err;
    });
    const dataOper = await this.monetService.getDataMonetization().toPromise().catch((err) => {
      return err;
    });
    this.appComponent.showLoader(false);
    if (dataForm.code !== this.codeResponse.RESPONSE_CODE_200) {
      this.messageError.showMessageError(dataForm.message, dataForm.code);
    }
    else if (dataOper.code !== this.codeResponse.RESPONSE_CODE_200) {
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else {
      this.containers = this.addDataDropdown(dataForm.response.reactiveForm, dataOper.response);
      this.dataInfo = dataOper.response.reglasMonetizacion;
      this.principalContainers = this.containers;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem('_auxForm', JSON.stringify(this.containers));
      this.changePeridicity(this.containers);
      this.catalogsTable.onLoadTable(this.dataInfo);
    }

  }

  addDataDropdown(dataForm: Container[], dataContent: any) {
    let cpDataContent = Object.assign({}, dataContent);
    delete cpDataContent.reglasMonetizacion;
    Object.entries(cpDataContent).forEach(([key, value]: any) => {
      value.forEach((ele: any) => {
        Object.entries(ele).forEach(([key, value]: any) => {
          if (typeof value === 'number') {
            ele['ky'] = ele[key];
            delete ele[key];
          }
          else {
            ele['value'] = ele[key];
            delete ele[key];
          }
        });
      });
    });
    dataForm.forEach((element: Container) => {
      element.controls.forEach((ctrl: Control) => {
        if (ctrl.controlType === 'dropdown' && ctrl.ky === 'idSociedad' && ctrl.content) {
          ctrl.content.contentList = cpDataContent.sociedades;
          ctrl.content.options = cpDataContent.sociedades;
        }
      });
    });
    return dataForm;
  }

  changePeridicity(dataForm: Container[]) {
    const idContainer = dataForm[0].idContainer;
    dataForm.forEach((element: Container) => {
      element.controls.forEach((ctrl: Control) => {
        if (ctrl.controlType === 'dropdown' && ctrl.ky === 'periodicidad') {
          const selectedValRequest: {} = {
            control: ctrl,
            idContainer: idContainer
          };
          this.onChangeCatsPetition(selectedValRequest);
        }
      });
    });
  }

  updateTable(){
    this.appComponent.showLoader(true);
    this.monetService.getDataMonetization().pipe(finalize(() => { this.appComponent.showLoader(false); }))
    .subscribe((data:any)=>{
      switch (data.code) {
        case this.codeResponse.RESPONSE_CODE_200:
          this.dataInfo = data.response.reglasMonetizacion;
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
      text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
      heightAuto: false
    });      
  });
  }

  // // metodos de visibility//
  onChangeCatsPetition($event: any) {
    if (!$event.control.visibility || $event.control.visibility.length <= 0) {
      return;
    }
    this.showButtonAdd = true;
    this.selectedValRequest = $event;
    const formaux = this.reactiveForm.principalForm?.get(this.selectedValRequest.idContainer) as FormGroup;
    const selectedVal = formaux.controls[this.selectedValRequest.control.ky].value;
    //busqueda del codigo
    if (this.selectedValRequest.control.content) {
      let finder = this.selectedValRequest.control.content.options.find((option: any) => option.ky === selectedVal);
      let dataForm;
      for (const datas of Object.values(this.reactiveForm.principalForm?.value)) {
        dataForm = Object(datas);
      }
      this.reactiveForm.principalForm = null;
      this.containers = [];
      finder = finder === ''? {value:'0-'} : finder === undefined ? {value:'0-'} : finder;
      this.createNewForm(
        this.selectedValRequest.control.visibility.filter((x: any) =>
          x.idOption.indexOf(finder.value.split('-')[0]) >= 0 && Number(x.visible) === 1), selectedVal, dataForm);
    }
  }

  sortControls(filterControls:Control[], filterCont:Container)
    {        
      return filterControls.concat(filterCont.controls.filter(x => !x.visibility)).sort((a,b)=>{
        if(a.order && b.order)
        {
          if(Number(a.order) > Number(b.order))
          {
            return 1;
          }
          if (Number(a.order) < Number(b.order))
          {
            return -1;
          }
        }
        return 0;
      });        
    }


  createNewForm(filter: any, selectedVal: any, dataForm: Object) {
    if (filter) {
      this.principalContainers.forEach(pcont => {
        const newContainer = Object.assign({}, pcont);
        const filterControls = pcont.controls.filter(x =>
          filter.find((y: any) => Number(y.idControl) === Number(x.idControl) && Number(y.idContainer) === Number(pcont.idContainer)));
        if (filterControls && filterControls.length > 0) {
          const control = newContainer.controls.find(x => x.ky === this.selectedValRequest.control.ky);
          if (control) {
            control.setAttributeValueByNameDropdown('value', selectedVal);
          }
          this.setControls(dataForm, newContainer);
          newContainer.controls = this.sortControls(filterControls, pcont);
          this.containers.push(newContainer);
        }
      });
    }
    this.reactiveForm.setContainers(this.containers);
  }

  setControls(dataForm:any, newContainer:Container){
    for (const ctrl in dataForm) {
      const control = newContainer.controls.find((x:Control) => x.ky === ctrl);
      let valueCtrl = dataForm[ctrl] === null ? '' : dataForm[ctrl];
      valueCtrl = typeof valueCtrl === 'boolean'? valueCtrl = valueCtrl.toString(): valueCtrl;
        if (control && valueCtrl !== '' && ctrl !== 'Periocidad') {
          if (control.controlType === 'dropdown' || control.controlType === 'autocomplete') {
            control.setAttributeValueByNameDropdown('value', valueCtrl);
          }
          else{
            control.setAttributeValueByName('value', valueCtrl);
          }
        }
    }
  }

}