import { animate, state, style, transition, trigger } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import Swal from 'sweetalert2';
import { UpdateModalInvoicesComponent } from '../update-modal-invoices/update-modal-invoices.component';
import { Control } from '@app/core/models/capture/controls.model';
import { Container } from '@app/core/models/capture/container.model';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { Observable } from 'rxjs';
import { FormInvoicesService } from '@app/core/services/invoices/formInvoices.service';
import { finalize } from 'rxjs/operators';
import { AppComponent } from '@app/app.component';
import { IResponseData } from '@app/core/models/ServiceResponseData/iresponse-data.model';
import { MonetizationRules } from '@app/core/models/ServiceResponseData/monetization-response.model';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { MonetizationModule } from '../../monetization/helper/monetization/monetization.module';
import { SortModule } from '@app/shared/sort/sort.module';
import moment from 'moment';


@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InvoicesTableComponent implements OnInit {

  @Input()dataInfo:Facturas[];
  dataSource:MatTableDataSource<Facturas>;
  formInvoicesService:FormInvoicesService;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipo','descripcionSubtipo', 'idReglaMonetizacion','tipoComprobante','tipoFactura', 'usuario', 'fecha','options', 'options2'];
  totalRows:number;
  pageEvent: PageEvent;
  containers:Container[];
  messageError:MessageErrorModule;
  public showLoad: boolean;
  public readonly loaderDuration: number;
  private readonly appComponent: AppComponent;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly monetizationModule: MonetizationModule = new MonetizationModule();
  private readonly sortModule: SortModule;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(private readonly injector:Injector, public refData?:MatDialog) {
    this.formInvoicesService = this.injector.get<FormInvoicesService>(FormInvoicesService);
    this.appComponent = this.injector.get<AppComponent>(AppComponent);
    this.messageError = new MessageErrorModule();
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<Facturas>();
    this.pageEvent= new PageEvent();
    this.showLoad = false;
    this.loaderDuration = 100;
    this.sortModule = new SortModule;
   }

  ngOnInit(): void {
    if(this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo);
    }
  }

  onLoadTable(dataInfo:Facturas[])  
  {
    this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo = dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);
    this.totalRows = this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    let sortedData:Facturas[] = this.dataInfo;
    const data = this.dataInfo.slice();
    if (!sort.active || sort.direction === '') {
      sortedData = data;
    }
    else{
      sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
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
          case 'tipoComprobante':
            return this.sortModule.compare(a.tipoComprobante, b.tipoComprobante, isAsc);
          case 'tipoFactura':
            return this.sortModule.compare(a.tipoFactura, b.tipoFactura, isAsc);
          case 'usuario':
            return this.sortModule.compare(a.usuario, b.usuario, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource = new MatTableDataSource<Facturas>(sortedData);
  }

  open(oInvoice:Facturas){
    let _auxForm = this.disabledFields(this.containers);
    this.appComponent.showLoader(true);
    const [idTipo, idSociedad] = [oInvoice.idTipo, oInvoice.idSociedad];
    const society = {
      idTipo,
      idSociedad
    };
    this.formInvoicesService.getMonetizacionRules(society).pipe(finalize(() => {
      this.appComponent.showLoader(false);
    })).subscribe((data: IResponseData<MonetizationRules[]> ) => {
      if(data.code === this.codeResponse.RESPONSE_CODE_201){
        _auxForm = this.monetizationModule.addDataControlMonetization(this.containers, data.response);
        return(
          this.refData?.open(UpdateModalInvoicesComponent,{
            width: '70%',
            data:{
              dataModal:oInvoice,
              auxForm:_auxForm
            }
          }).afterClosed().subscribe((oData:ResponseTable)=> {
            if(oData !== undefined && oData.status === true){
              this.dataInfo = oData.data;
              this.onLoadTable(this.dataInfo);
            }
          })
        );
      }
      else{
        return(
          this.messageError.showMessageError(data.message.toString(), data.code)
          );
      }
    },(err) => {
      return(
      this.messageError.showMessageError('Por el momento no podemos proporcionar su Solicitud.', err.status)
      );
    });
  }

  show(oInvoice:Facturas):void{
    let registro = '';
    // const cfdi = oInvoice.usoCFDI === 'S' ? 'Si':'No';
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 
    2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 
    2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>
     Sociedad </b></td><td style="padding:5px"> ${oInvoice.razonSocial} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>
     Operación </b></td><td style="padding:5px"> ${oInvoice.descripcionTipo} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Sub-Operación </b></td><td style="padding:5px"> ${oInvoice.descripcionSubtipo} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>
     Monetización </b></td><td style="padding:5px"> ${oInvoice.idReglaMonetizacion} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Tipo de Comprobante </b></td><td style="padding:5px"> ${oInvoice.tipoComprobante} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>
     Tipo de Factura </b></td><td style="padding:5px"> ${oInvoice.tipoFactura} </td></tr>`);
    // registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    // Método de Pago </b></td><td style="padding:5px">  ${oInvoice.metodo} </td></tr>`);        
    // registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    // Código de Pago  </b></td><td style="padding:5px">  ${oInvoice.codigo} </td></tr>`);
    // registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    // Clave de Servicio </b></td><td style="padding:5px">  ${oInvoice.claveServicio} </td></tr>`);        
    // registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    // Descripción de la Factura  </b></td><td style="padding:5px">  ${oInvoice.descripcionFactura} </td></tr>`);
    // registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    // CFDI </b></td><td style="padding:5px">  ${cfdi} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Usr. Modificó </b></td><td style="padding:5px">  ${oInvoice.usuario} </td></tr>`);        
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Ult. Modificación  </b></td><td style="padding:5px">  ${oInvoice.fecha} </td></tr>`);

     Swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;">
       Datos de la Factura </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    });
  }

  disabledFields(_auxForm:Container[]){
    _auxForm.forEach((cont: Container) => {
      cont.controls.forEach((ctrl:Control) => {
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipo' || ctrl.ky === 'idSubtipo' ||  ctrl.ky === 'idReglaMonetizacion'){
          ctrl.disabled = true;
        }
      });
    });
    return _auxForm;
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

}
