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
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

@Component({
  selector: 'app-monetization-table',
  templateUrl: './monetization-table.component.html',
  styleUrls: ['./monetization-table.component.sass']
})

export class MonetizationTableComponent implements OnInit {

  @Input()dataInfo:Monetizacion[];
  dataSource:MatTableDataSource<Monetizacion>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipoOperacion', 'descSubTipoOperacion', 'idReglaMonetizacion', 'fechaInicio','fechaFin','options', 'options2'];
  totalRows:number;
  pageEvent: PageEvent;
  containers:Container[];
  monetService:FormMonetizationsService;
  messageError:MessageErrorModule;
  private showLoad: boolean;
  private loaderDuration: number;
  private periodicity: PeriodicityModule;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();


  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private injector:Injector,public refData?:MatDialog) { 
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0; 
    this.showLoad = false;
    this.dataSource = new MatTableDataSource<Monetizacion>(); 
    this.pageEvent= new PageEvent();   
    this.loaderDuration = 100;
    this.periodicity = new PeriodicityModule();  
    this.messageError = new MessageErrorModule();
   }

  ngOnInit(): void {    
    if(this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo);
    }
  }

  onLoadTable(dataInfo:any)  
  {
    this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo = dataInfo.reglasMonetizacion;
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }
  
  async open(obData:Monetizacion){
    this.showLoader(true);
    const data = await this.monetService.getDataMonetizationById(obData).toPromise().catch((err) => {
      return err;
    });
    this.showLoader(false);
    if (data.code !== this.codeResponse.RESPONSE_CODE_200) {
      return(this.messageError.showMessageError(data.message, data.code));
    }
    else{
      let oMonet:any = data.response.reglasMonetizacion;
      oMonet.tipoMontoMonetizacion = oMonet.tipoMontoMonetizacion === 'P'?  1 : 'F'? this.codeResponseMagic.RESPONSE_CODE_2 : this.codeResponseMagic.RESPONSE_CODE_3;
      oMonet.emisionFactura = oMonet.emisionFactura == true? 'true': 'false';
      oMonet.indicadorOperacion = oMonet.indicadorOperacion == 'C'?'false':'true';
      let _auxForm = this.disabledFields(this.containers);
      return (
        this.refData?.open(UpdateModalMonetizationComponent,{
          width: '70%',
          data:{
            dataModal:oMonet,
            auxForm:_auxForm
          }
        }).afterClosed().subscribe((oData:any)=>{
          if(oData !== undefined)
            if(oData.status === true){
              this.dataInfo = oData.data;
              this.onLoadTable(this.dataInfo);
            }
        })
      );
      }
  }

  async show(oElement:Monetizacion){
    this.showLoader(true);
    let data = await this.monetService.getDataMonetizationById(oElement).toPromise().catch((err) => {
      return err;
    });
    this.showLoader(false);
    if (data.code !== this.codeResponse.RESPONSE_CODE_200) {
      return(this.messageError.showMessageError(data.message, data.code));
    }
    else{
      let oMonet:any = data.response.reglasMonetizacion;
      oMonet.emisionFactura = oMonet.emisionFactura == true? 'SI':'NO';
      oMonet.indicadorOperacion = oMonet.indicadorOperacion == 'C'?'COBRO':'PAGO';
      oMonet.tipoMonto = oMonet.tipoMonto === 'P'? 'PORCENTAJE' : 'F' ? 'FIJO' : 'UNIDADES';
      let registro:string='';
      registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Sociedad </b></td><td style="padding:5px"> ${oMonet.razonSocial} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Operación </b></td><td style="padding:5px"> ${oMonet.descripcionTipoOperacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Sub-Operación </b></td><td style="padding:5px"> ${oMonet.descSubTipoOperacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Indicador Operación </b></td><td style="padding:5px"> ${oMonet.indicadorOperacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Monto Monetización </b></td><td style="padding:5px"> ${oMonet.montoMonetizacion} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Tipo de Monto </b></td><td style="padding:5px"> ${oMonet.tipoMonto} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Tipo de Impuesto </b></td><td style="padding:5px"> ${oMonet.idTipoImpuesto} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Emisión de Factura </b></td><td style="padding:5px"> ${oMonet.emisionFactura} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Segmento </b></td><td style="padding:5px"> ${oMonet.segmento} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Divisa </b></td><td style="padding:5px"> ${oMonet.codigoDivisa} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Periodicidad de corte </b></td><td style="padding:5px"> `+ this.periodicity.getPeriodicity_show(oMonet.periodicidadCorte) +` </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Fecha Inicio De Vigencia </b></td><td style="padding:5px"> ${oMonet.fechaInicioVigencia} </td></tr>`);            
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Fecha Fin De Vigencia </b></td><td style="padding:5px"> ${oMonet.fechaFinVigencia} </td></tr>`);
      return( swal.fire({             
        html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> Datos de la contabilidad </div><br/> <br/>${registro}`,
        showCancelButton: false,
        width: '60%'
      }));
    }
  } 

  disabledFields(_auxForm:any){
    let element:any; let ctrl:any;
    for(element of _auxForm)
      for(ctrl of element.controls) 
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipoOperacion' || ctrl.ky === 'idSubTipoOperacion'){
          ctrl.disabled = true;
        }
    return _auxForm;
  }
  
  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

}