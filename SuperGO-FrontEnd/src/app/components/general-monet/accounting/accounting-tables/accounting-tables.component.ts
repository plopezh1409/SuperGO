import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import swal from 'sweetalert2';
import { UpdateModalAccountingComponent } from '../update-modal-accounting/update-modal-accounting.component';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { Control } from '@app/core/models/capture/controls.model';
import { Container } from '@app/core/models/capture/container.model';
import moment from 'moment';
import { AppComponent } from '@app/app.component';
import { MonetizationModule } from '../../monetization/helper/monetization/monetization.module';
import { MatSort, Sort } from '@angular/material/sort';
import { SortModule } from '@app/shared/sort/sort.module';
import Swal from 'sweetalert2';
import { ReportsModule } from '@app/shared/reports/reports.module';

@Component({
  selector: 'app-accounting-tables',
  templateUrl: './accounting-tables.component.html',
  styleUrls: ['./accounting-tables.component.sass']
})

export class AccountingTablesComponent implements OnInit {

  @Input()dataInfo:Contabilidad[];
  accountService:FormAccountingsService;
  messageError: MessageErrorModule;
  dataSource:MatTableDataSource<Contabilidad>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipo', 'descripcionSubtipo', 'idReglaMonetizacion',
    'fechaInicio','fechaFin', 'usuario', 'fecha', 'options', 'options2'];
  totalRows:number;
  pageEvent: PageEvent;
  containers: Container[];
  report: ReportsModule;
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  private readonly monetizationModule: MonetizationModule = new MonetizationModule();
  private readonly sortModule: SortModule;
  private startRow: string;
  private endRow: string;
  appComponent:AppComponent;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(private readonly injector:Injector,public refData?:MatDialog) {
    this.accountService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.appComponent = this.injector.get<AppComponent>(AppComponent);
    this.messageError = new MessageErrorModule();
    this.containers = [];
    this.dataInfo=[];
    this.dataSource = new MatTableDataSource<Contabilidad>();
    this.pageEvent= new PageEvent();
    this.totalRows = 0;
    this.sortModule = new SortModule;
    this.report = new ReportsModule();
    this.startRow = '<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>';
    this.endRow = '</b></td><td style="padding:5px">';
   }

  ngOnInit(): void {
    if(this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo);
    }
  }

  onLoadTable(dataInfo:Contabilidad[])
  {
    this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo=dataInfo;
    this.dataSource = new MatTableDataSource<Contabilidad>(this.dataInfo);
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    let sortedData:Contabilidad[] = this.dataInfo;
    const data = this.dataInfo.slice();

    if(this.dataSource.filter !== ''){
      return;
    }

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
          case 'fechaInicio':
            return this.sortModule.compare(moment(a.fechaInicio, 'DD/MM/YYYY'), moment(b.fechaInicio, 'DD/MM/YYYY'), isAsc);
          case 'fechaFin':
            return this.sortModule.compare(moment(a.fechaFin, 'DD/MM/YYYY'), moment(b.fechaFin, 'DD/MM/YYYY'), isAsc);
          case 'usuario':
            return this.sortModule.compare(a.usuario, b.usuario, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource = new MatTableDataSource<Contabilidad>(sortedData);
  }

  async open(element:Contabilidad){
    this.appComponent.showLoader(true);
    const [idTipo, idSociedad] = [element.idTipo, element.idSociedad];
    const society = {
      idTipo,
      idSociedad
    };
    const data = await this.accountService.getAccountingById(element).toPromise().catch((err) => {
      return err;
    });
    const monetRules = await this.accountService.getMonetizacionRules(society).toPromise().catch((err) => {
      return err;
    });
    this.appComponent.showLoader(false);
    if (data.code !== this.codeResponse.RESPONSE_CODE_200) {
      return(this.messageError.showMessageError(data.message, data.code));
    }
    else if(monetRules.code !== this.codeResponse.RESPONSE_CODE_201){
      return(this.messageError.showMessageError(monetRules.message, monetRules.code));
    }
    else{
      const [oConta] = data.response;
      oConta.contabilidadDiaria = oConta.contabilidadDiaria === 'D'?'true':'false';
      oConta.indicadorIVA = oConta.indicadorIVA === 'AA'?'true':'false';
      oConta.indicadorOperacion = oConta.indicadorOperacion === 'C'? '1' : '2';
      let _auxForm = this.disabledFields(this.containers);
      _auxForm = this.monetizationModule.addDataControlMonetization(_auxForm, monetRules.response);
      return( this.refData?.open(UpdateModalAccountingComponent,{
        width: '70%',
        data:{
          dataModal:oConta,
          auxForm:_auxForm
        }
      }).afterClosed().subscribe((oData:ResponseTable)=>{
        if(oData !== undefined && oData.status === true){
          this.dataInfo = oData.data;
          this.onLoadTable(this.dataInfo);
        }
      }));
    }
  }

  async show(element:Contabilidad){
    this.appComponent.showLoader(true);
    const data = await this.accountService.getAccountingById(element).toPromise().catch((err) => {
      return err;
    });
    this.appComponent.showLoader(false);
    if (data.code !== this.codeResponse.RESPONSE_CODE_200) {
      return(this.messageError.showMessageError(data.message, data.code));
    }
    else{
      const [oConta]:Contabilidad[] = data.response;
      oConta.contabilidadDiaria = oConta.contabilidadDiaria === 'D'?'CONTABILIDAD DIARIA':'CONTABILIDAD AL CORTE';
      oConta.indicadorIVA = oConta.indicadorIVA === 'AA'?'APLICA IVA':'NO APLICA IVA';
      oConta.indicadorOperacion = oConta.indicadorOperacion === 'C'?'CARGO':'ABONO';
      let registro = '';
      registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
      registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important;
      width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px;
      text-align:center;"><b><i>Descripción</i></b></td></tr>`);
      registro = registro.concat(`${this.startRow} Sociedad ${this.endRow} ${oConta.razonSocial} </td></tr>`);
      registro = registro.concat(`${this.startRow} Operación ${this.endRow}  ${oConta.descripcionTipo} </td></tr>`);
      registro = registro.concat(`${this.startRow} Sub-Operación ${this.endRow}  ${oConta.descripcionSubtipo} </td></tr>`);
      registro = registro.concat(`${this.startRow} Contabilidad ${this.endRow}  ${oConta.contabilidadDiaria} </td></tr>`);
      registro = registro.concat(`${this.startRow} Número de Apunte ${this.endRow}  ${oConta.numeroApunte} </td></tr>`);
      registro = registro.concat(`${this.startRow} Sociedad GL ${this.endRow}  ${oConta.sociedadGl} </td></tr>`);
      registro = registro.concat(`${this.startRow} Tipo de Cuenta ${this.endRow}  ${oConta.tipoCuenta} </td></tr>`);
      registro = registro.concat(`${this.startRow} Indicador de Operación ${this.endRow}  ${oConta.indicadorOperacion} </td></tr>`);
      registro = registro.concat(`${this.startRow} Clase de Documento ${this.endRow}  ${oConta.claseDocumento} </td></tr>`);
      registro = registro.concat(`${this.startRow} Concepto ${this.endRow}  ${oConta.concepto} </td></tr>`);
      registro = registro.concat(`${this.startRow} Centro Destino ${this.endRow}  ${oConta.centroDestino} </td></tr>`);
      registro = registro.concat(`${this.startRow} IVA ${this.endRow}  ${oConta.indicadorIVA} </td></tr>`);
      registro = registro.concat(`${this.startRow} Cuenta SAP ${this.endRow}  ${oConta.cuentaSAP} </td></tr>`);
      registro = registro.concat(`${this.startRow} Monetización ${this.endRow}  ${oConta.idReglaMonetizacion} </td></tr>`);
      registro = registro.concat(`${this.startRow} Inicio Vigencia ${this.endRow}  ${moment(oConta.fechaInicio).format('DD/MM/YYYY')} </td></tr>`);
      registro = registro.concat(`${this.startRow} Fin Vigencia ${this.endRow}  ${moment(oConta.fechaFin).format('DD/MM/YYYY')} </td></tr>`);
      registro = registro.concat(`${this.startRow} Ultima Modificación ${this.endRow}</td></tr>`);
      registro = registro.concat(`${this.startRow} Usuario ${this.endRow}  ${oConta.usuario} </td></tr>`);
      registro = registro.concat(`${this.startRow} Fecha ${this.endRow}  ${oConta.fecha} </td></tr>`);
      return(swal.fire({
        html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;">
        Datos de la Contabilidad </div><br/> <br/>${registro}`,
        showCancelButton: false,
        width: '60%'
      })
      );
  }
  }

  disabledFields(_auxForm:Container[]){
    _auxForm.forEach((cont: Container) => {
      cont.controls.forEach((ctrl:Control) => {
        if(ctrl.ky === 'idSociedad' || ctrl.ky === 'idTipo' || ctrl.ky === 'idSubtipo'
          || ctrl.ky === 'idReglaMonetizacion'){
          ctrl.disabled = true;
        }
      });
    });
    return _auxForm;
  }

    ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

  createReport(){
    const headers =['Razon Social','Operacion','Sub Operacion','Monetizacion', 'Numero Apunte', 'Fecha Inicio Vigencia',
                    'Fecha Fin Vigencia','Ultima Modificacion','Fecha Modificacion'];
    if(this.dataSource.filteredData.length <= 0){
      Swal.fire({
        icon: 'warning',
        title: 'Reporte',
        text: 'El reporte no contiene información',
        heightAuto: false
      });
      return;
    }
    const dataReporting = this.dataSource.filteredData.map((data:Contabilidad) => {
      let obj = Object.assign(data);
      delete obj.idSociedad;
      delete obj.idTipo;
      delete obj.idSubtipo;
      return obj;
    });
    this.report.descargarExcel('Contabilidad', dataReporting, headers);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
