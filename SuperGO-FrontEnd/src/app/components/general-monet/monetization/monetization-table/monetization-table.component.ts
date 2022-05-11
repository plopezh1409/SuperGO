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
import moment, { Moment } from 'moment';
import { AppComponent } from '@app/app.component';
import { MatSort, Sort } from '@angular/material/sort';
import { SortModule } from '@app/shared/sort/sort.module';

@Component({
  selector: 'app-monetization-table',
  templateUrl: './monetization-table.component.html',
  styleUrls: ['./monetization-table.component.sass']
})

export class MonetizationTableComponent implements OnInit {

  @Input()dataInfo:Monetizacion[];
  dataSource:MatTableDataSource<Monetizacion>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipo', 'descripcionSubtipo', 'idReglaMonetizacion', 'fechaInicio','fechaFin',
  'usuario','fecha','options', 'options2'];
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
  private readonly sortModule: SortModule;


  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  
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
    this.sortModule = new SortModule();
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

  sortData(sort: Sort) {
    let sortedData:Monetizacion[] = this.dataInfo;
    const data = this.dataInfo.slice();
    if (!sort.active || sort.direction === '') {
      sortedData = data;
    }
    else{
      sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'fechaInicio':
            return this.sortModule.compare(moment(a.fechaInicio, 'DD/MM/YYYY'), moment(b.fechaInicio, 'DD/MM/YYYY'), isAsc);
          case 'fechaFin':
            return this.sortModule.compare(moment(a.fechaFin, 'DD/MM/YYYY'), moment(b.fechaFin, 'DD/MM/YYYY'), isAsc);
          case 'fecha':
            return this.sortModule.compare(moment(a.fecha, 'DD/MM/YYYY'), moment(b.fecha, 'DD/MM/YYYY'), isAsc);
          case 'razonSocial':
            return this.sortModule.compare(a.razonSocial, b.razonSocial, isAsc);
          case 'descripcionTipo':
            return this.sortModule.compare(a.descripcionTipo, b.descripcionTipo, isAsc);
          case 'descripcionSubtipo':
            return this.sortModule.compare(a.descripcionSubtipo, b.descripcionSubtipo, isAsc);
          case 'idReglaMonetizacion':
            return this.sortModule.compare(a.idReglaMonetizacion, b.idReglaMonetizacion, isAsc);
          case 'usuario':
            return this.sortModule.compare(a.usuario, b.usuario, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource = new MatTableDataSource<Monetizacion>(sortedData);
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
      oMonet.tipoMonto = oMonet.tipoMonto === 'P'?  1 : 'F'? this.codeResponseMagic.RESPONSE_CODE_2 : this.codeResponseMagic.RESPONSE_CODE_3;
      oMonet.emisionFactura = oMonet.emisionFactura === true? 'true': 'false';
      oMonet.indicadorOperacion = oMonet.indicadorOperacion === 'C'?'false':'true';
      oMonet.fechaInicio = this.monetModule.getDateTime(oMonet.fechaInicio);
      oMonet.fechaFin = this.monetModule.getDateTime(oMonet.fechaFin);
      oMonet.montoMonetizacion = this.controlDecimal.obtenerStrConFormato(oMonet.montoMonetizacion.toString());
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
      oMonet.indicador = oMonet.indicador === 'C'?'COBRO':'PAGO';
      oMonet.tipoMonto = oMonet.tipoMonto === 'P'? 'PORCENTAJE' : 'F' ? 'FIJO' : 'UNIDADES';
      const fechaInicio = this.monetModule.getDateTime(oMonet.fechaInicio);
      const fechaFin = this.monetModule.getDateTime(oMonet.fechaFin);
      let registro ='';
      registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; 
      padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px; text-align:center;">
      <b><i>Descripción</i></b></td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Sociedad </b></td><td style="padding:5px"> ${oMonet.razonSocial} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Operación </b></td><td style="padding:5px"> ${oMonet.descripcionTipo} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Sub-Operación </b></td><td style="padding:5px"> ${oMonet.descripcionSubtipo} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Indicador Operación </b></td><td style="padding:5px"> ${oMonet.indicadorOperacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Monto Monetización </b></td><td style="padding:5px">${this.controlDecimal.obtenerStrConFormato(oMonet.montoMonetizacion)} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Tipo de Monto </b></td><td style="padding:5px"> ${oMonet.tipoMonto} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Tipo de Impuesto </b></td><td style="padding:5px"> ${oMonet.idTipoImpuesto} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Emisión de Factura </b></td><td style="padding:5px"> ${oMonet.emisionFactura} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Segmento </b></td><td style="padding:5px"> ${oMonet.segmento} </td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Referencia de Pago </b></td><td style="padding:5px"> ${oMonet.referenciaPago} </td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Divisa </b></td><td style="padding:5px"> ${oMonet.codigoDivisa} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Periodicidad de corte </b></td><td style="padding:5px"> ${this.periodicity.getPeriodicity_show(oMonet.periodicidadCorte)} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Fecha Inicio De Vigencia </b></td><td style="padding:5px"> ${fechaInicio} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Fecha Fin De Vigencia </b></td><td style="padding:5px"> ${fechaFin} </td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Ultima Modificación </b></td><td style="padding:5px"></td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Usuario </b></td><td style="padding:5px">  ${oMonet.usuario} </td></tr>`);        
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
      Fecha  </b></td><td style="padding:5px">  ${oMonet.fecha} </td></tr>`);
      return( swal.fire({             
        html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> 
        Datos de la Monetización </div><br/> <br/>${registro}`,
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