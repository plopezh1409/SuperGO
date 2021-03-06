import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';
import swal from 'sweetalert2';
import { UpdateModalMonetizationComponent } from '../update-modal-monetization/update-modal-monetization.component';
import { finalize, timeout } from 'rxjs/operators';
import { PeriodicityModule } from '../helper/periodicity/periodicity.module';
import { Container } from '@app/core/models/capture/container.model';
import { ServiceResponseCodes, ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { Control } from '@app/core/models/capture/controls.model';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { MonetizationModule } from '../helper/monetization/monetization.module';
import { ControlDecimal } from '@app/core/models/public/control-decimal.model';
import moment from 'moment';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-monetization-table',
  templateUrl: './monetization-table.component.html',
  styleUrls: ['./monetization-table.component.sass']
})

export class MonetizationTableComponent implements OnInit {

  @Input()dataInfo:Monetizacion[];
  dataSource:MatTableDataSource<Monetizacion>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipo', 'descripcionSubtipo', 'idReglaMonetizacion', 'fechaInicio','fechaFin','options', 'options2'];
  totalRows:number;
  pageEvent: PageEvent;
  containers:Container[];
  monetService:FormMonetizationsService;
  messageError:MessageErrorModule;
  private readonly controlDecimal: ControlDecimal;
  private readonly monetModule:MonetizationModule;
  private readonly periodicity: PeriodicityModule;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
  private readonly appComponent: AppComponent;


  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private readonly injector:Injector,public refData?:MatDialog) { 
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.appComponent = this.injector.get<AppComponent>(AppComponent);
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<Monetizacion>(); 
    this.pageEvent= new PageEvent();
    this.periodicity = new PeriodicityModule();  
    this.messageError = new MessageErrorModule();
    this.monetModule = new MonetizationModule();
    this.controlDecimal = new ControlDecimal();
   }

  ngOnInit(): void {    
    if(this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo);
    }
  }

  onLoadTable(dataInfo:Monetizacion[])  
  {
    this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo = dataInfo;
    this.dataSource = new MatTableDataSource<Monetizacion>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }
  
  async open(obData:Monetizacion){
    this.appComponent.showLoader(true);
    const data = await this.monetService.getDataMonetizationById(obData).toPromise().catch((err) => {
      return err;
    });
    this.appComponent.showLoader(false);
    if (data.code !== this.codeResponse.RESPONSE_CODE_200) {
      return(this.messageError.showMessageError(data.message, data.code));
    }
    else{
      const [oMonet] = data.response;
      let monto = oMonet.tipoMonto;
      if(monto === 'P'){
        oMonet.tipoMonto = 1;
      }
      else if(monto === 'F'){
        oMonet.tipoMonto = 2;
      }
      else{
        oMonet.tipoMonto = 3;
      }
      oMonet.emisionFactura = oMonet.emisionFactura === true? 'true': 'false';
      oMonet.indicadorOperacion = oMonet.indicadorOperacion === 'C'?'false':'true';
      oMonet.fechaInicio = this.monetModule.getDateTime(oMonet.fechaInicio);
      oMonet.fechaFin = this.monetModule.getDateTime(oMonet.fechaFin);
      oMonet.montoMonetizacion = this.controlDecimal.obtenerStrConFormato(oMonet.montoMonetizacion.toString()) === null? 0:  this.controlDecimal.obtenerStrConFormato(oMonet.montoMonetizacion.toString());
      const _auxForm = this.disabledFields(this.containers);
      return (
        this.refData?.open(UpdateModalMonetizationComponent,{
          width: '70%',
          data:{
            dataModal:oMonet,
            auxForm:_auxForm
          }
        }).afterClosed().subscribe((oData:ResponseTable)=>{
          if(oData !== undefined && oData.status === true){
            this.dataInfo = oData.data;
            this.onLoadTable(this.dataInfo);
          }
        })
      );
      }
  }

  async show(oElement:Monetizacion){
    this.appComponent.showLoader(true);
    const data = await this.monetService.getDataMonetizationById(oElement).toPromise().catch((err) => {
      return err;
    });
    this.appComponent.showLoader(false);
    if (data.code !== this.codeResponse.RESPONSE_CODE_200) {
      return(this.messageError.showMessageError(data.message, data.code));
    }
    else{
      const [oMonet] = data.response;
      oMonet.emisionFactura = oMonet.emisionFactura? 'SI':'NO';
      oMonet.indicadorOperacion = oMonet.indicadorOperacion === 'C'?'COBRO':'PAGO';
      let monto = '';
      let impuesto = '';
      if(oMonet.tipoMonto === 'P'){
        monto = 'PORCENTAJE';
      }
      else if(oMonet.tipoMonto === 'F'){
        monto = 'FIJO';
      }
      else{
        monto = 'UNIDADES';
      }
      if(oMonet.idTipoImpuesto === 0 ){
        impuesto = 'SIN IMPUESTO';
      }
      else if(oMonet.idTipoImpuesto === 1 ){
        impuesto ='IMPUESTO CENTRAL 16%';
      }
      else{
        impuesto = 'IMPUESTO FRONTERIZO 11%';
      }
      const fechaInicio = this.monetModule.getDateTimeSlash(oMonet.fechaInicio);
      const fechaFin = this.monetModule.getDateTimeSlash(oMonet.fechaFin);
      const montoMonetizacion = this.controlDecimal.obtenerStrConFormato(oMonet.montoMonetizacion) === null ? 0 : this.controlDecimal.obtenerStrConFormato(oMonet.montoMonetizacion);
      let registro ='';
      registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; 
      padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px; text-align:center;">
      <b><i>Descripci??n</i></b></td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Sociedad </b></td><td style="padding:5px"> ${oMonet.razonSocial} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Operaci??n </b></td><td style="padding:5px"> ${oMonet.descripcionTipo} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Sub-Operaci??n </b></td><td style="padding:5px"> ${oMonet.descripcionSubtipo} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Indicador Operaci??n </b></td><td style="padding:5px"> ${oMonet.indicadorOperacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Monto Monetizaci??n </b></td><td style="padding:5px">${montoMonetizacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Tipo de Monto </b></td><td style="padding:5px"> ${monto} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Tipo de Impuesto </b></td><td style="padding:5px"> ${impuesto} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Emisi??n de Factura </b></td><td style="padding:5px"> ${oMonet.emisionFactura} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Segmento </b></td><td style="padding:5px"> ${oMonet.segmento} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Divisa </b></td><td style="padding:5px"> ${oMonet.codigoDivisa} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Periodicidad de corte </b></td><td style="padding:5px"> ${this.periodicity.getPeriodicity_show(oMonet.periodicidadCorte)} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Fecha Inicio De Vigencia </b></td><td style="padding:5px"> ${fechaInicio} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Fecha Fin De Vigencia </b></td><td style="padding:5px"> ${fechaFin} </td></tr>`);
      return( swal.fire({             
        html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> 
        Datos de la Monetizaci??n </div><br/> <br/>${registro}`,
        showCancelButton: false,
        width: '60%'
      }));
    }
  } 

  disabledFields(_auxForm:Container[]){
    _auxForm.forEach((cont: Container) => {
      cont.controls.forEach((ctrl:Control) => {
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipo' || ctrl.ky === 'idSubtipo'){
          ctrl.disabled = true;
        }
      });
    });
    return _auxForm;
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

}