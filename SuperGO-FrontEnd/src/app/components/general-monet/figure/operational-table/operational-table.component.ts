import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatosDeSalida, Tablero } from '@app/core/models/board/board.model';
import Swal from 'sweetalert2';
//SERVICES
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import * as XLSX from 'xlsx';
import { SortModule } from '@app/shared/sort/sort.module';
import { FormControl, FormGroup } from '@angular/forms';
import { FORMATOS_FECHA } from '@app/components/reactive-form/controls/datepicker-control/datepicker-control.component';

import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FigureService } from '@app/core/services/figure/figure.service';

import { MessageErrorModule } from '@app/shared/message-error/message-error.module';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';


@Component({
  selector: 'app-operational-table',
  templateUrl: './operational-table.component.html',
  styleUrls: ['./operational-table.component.sass'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
  },
  { provide: MAT_DATE_FORMATS, useValue: FORMATOS_FECHA },
  ]
})

export class OperationalTableComponent implements OnInit {

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  public showLoad = false;
  private tblArrayExcel: string[];
  private readonly codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  dataInfo: DatosDeSalida[];
  dataHeader: Tablero[];
  dataSource: MatTableDataSource<DatosDeSalida>;
  dataSourceHeader: MatTableDataSource<Tablero>;
  // displayedColumnsHeader: string[] = ['idTipo', 'idSubtipo', 'descripcionTipo'];
  displayedColumns: string[] = ['suid','montoMonetizacion','descripcionTipo','razonSocial','montoOperaciones','documentoContable'];
  totalRows: number;
  containers: Container[];
  sortModule: SortModule;
  boardService:FigureService;
  messageError:MessageErrorModule;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentProject: any;

  constructor(private readonly injector: Injector, public refData?: MatDialog,) {
    this.boardService = this.injector.get<FigureService>(FigureService);
    this.dataInfo = [];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<DatosDeSalida>();
    this.tblArrayExcel = [];
    this.dataHeader = [];
    this.dataSourceHeader = new MatTableDataSource<Tablero>();
    this.sortModule = new SortModule;
    this.messageError = new MessageErrorModule();
  }

  ngOnInit(): void {
    if (this.dataInfo.length !== 0) {
      this.showLoad = true;
      this.onLoadTable(this.dataInfo, this.dataHeader);
      this.showLoad = false;
    }
  }

  onLoadTable(dataInfo: DatosDeSalida[], dataHeader: Tablero[]) {
    this.dataInfo = dataInfo;
    this.dataSource = new MatTableDataSource<DatosDeSalida>(this.dataInfo);
    this.totalRows = this.dataInfo.length;
    this.dataSource.paginator = this.paginator;

    this.dataHeader = dataHeader;
    this.dataSourceHeader = new MatTableDataSource<Tablero>(this.dataHeader);
  }

  open(oSociedad: DatosDeSalida) {
  }

  show(oTablero: Tablero): void {
    let encabezado = '';
    let registro = '';
    let detalleSuma = '';

    // encabezado = encabezado.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    // encabezado = encabezado.concat('<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b> ID MONETIZACION </b></td>');
    // encabezado = encabezado.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b> TIPO OPERACION </b></td>');
    // encabezado = encabezado.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b> DESCRIPCION TIPO REGLA DE MONETIZACION </b></td></tr>');
    // this.dataHeader.map(row => {
    //   encabezado = encabezado.concat(`<tr><td style=":20%; padding:5px; text-align:center;">${row.idTipo}</td><td style="width:20%; padding:5px; text-align:center;">${row.idSubtipo}</td><td style="width:20%; padding:5px; text-align:center;">${row.descripcionTipo}</td></tr>`);
    // })
    // encabezado = encabezado.concat(`</table>`);

    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 
    2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  
    style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);

    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    ID MONETIZACION </b></td><td style="padding:5px"> ${oTablero.idTipo} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    TIPO OPERACION </b></td><td style="padding:5px"> ${oTablero.idSubtipo} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    DESCRIPCION TIPO REGLA DE MONETIZACION </b></td><td style="padding:5px"> ${oTablero.descripcionTipo} </td></tr>`);

    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    FECHA OPERACION </b></td><td style="padding:5px"> ${oTablero.fechaOperacion} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    # TX SAPP </b></td><td style="padding:5px"> ${oTablero.numeroOperaciones} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center> <b> 
    MONTO TX SAPP </b></td><td style="padding:5px"> ${oTablero.montoOperaciones} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center> <b> 
    # TX MONETIZADAS </b></td><td style="padding:5px"> ${oTablero.numeroOperaciones} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO TX MONETIZADAS </b></td><td style="padding:5px"> ${oTablero.montoOperaciones} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO MONETIZACION </b></td><td style="padding:5px"> ${oTablero.montoMonetizacion} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    IVA </b></td><td style="padding:5px"> ${oTablero.iva} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO TOTAL </b></td><td style="padding:5px"> ${oTablero.montoTotal} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    FECHA DE CORTE FACTURACION </b></td><td style="padding:5px"> ${oTablero.fechaContable} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    SEMANA </b></td><td style="padding:5px"> ${oTablero.semana} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    RAZON SOCIAL </b></td><td style="padding:5px"> ${oTablero.razonSocial} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    DOCUMENTO CONTABLE </b></td><td style="padding:5px"> ${oTablero.documentoContable} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    FECHA CONTABLE </b></td><td style="padding:5px"> ${oTablero.fechaContable} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    CUENTA BALANCE </b></td><td style="padding:5px"> ${oTablero.cuentaBalance} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO BALANCE </b></td><td style="padding:5px"> ${oTablero.montoBalance} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    CUENTA RESULTADOS </b></td><td style="padding:5px"> ${oTablero.cuentaResultados} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO RESULTADOS </b></td><td style="padding:5px"> ${oTablero.montoResultados} </td></tr></table>`);

    detalleSuma = detalleSuma.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    detalleSuma = detalleSuma.concat('<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>NUMERO DE OPERACION</b></td>');
    detalleSuma = detalleSuma.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>MONTO DE OPERACION</b></td>');
    detalleSuma = detalleSuma.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>MONTO DE MONETIZACION</b></td>');
    detalleSuma = detalleSuma.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>IVA</b></td>');
    detalleSuma = detalleSuma.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>MONTO TOTAL</b></td></tr>');
    oTablero.detallesOperaciones.map(row => {
      detalleSuma = detalleSuma.concat(`<tr><td style=":20%; padding:5px; text-align:center;">${row.numeroOperacion}</td><td style="width:20%; padding:5px; text-align:center;">${row.montoOperacion}</td><td style="width:20%; padding:5px; text-align:center;">${row.montoMonetizacion}</td><td style="width:20%; padding:5px; text-align:center;">${row.iva}</td><td style="width:20%; padding:5px; text-align:center;">${row.montoTotal}</td></tr>`);
    })
    detalleSuma = detalleSuma.concat(`</table>`);

    Swal.fire({
      html: `<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> 
      DATOS DEL TABLERO OPERATIVO ${encabezado} <br/> ${registro} <br/> ${detalleSuma} </div>`,
      showCancelButton: false,
      width: '50%'
    });
  }

  ngOnDestroy(): void {
    return (this.refData?.closeAll());
  }

  getPlaneObject(tx: any, pattern: string, objJson: string) {

    Object.keys(tx).forEach((ky) => {
      if (typeof tx[ky] === 'object') {
        if (Array.isArray(tx[ky])) {
          tx[ky].forEach((x: any) => {
            if (typeof x === 'object') {
              this.tblArrayExcel.push(Object.assign({}, tx, x));
            }
          });
        }
        else {
          pattern = ky;
          objJson = `${this.getPlaneObject(tx[ky], pattern, objJson)}`;
        }
      }
      else {
        if (ky != 'estatusContabilizacion') {
          const patt = pattern.trim().length > 0 ? `${pattern.trim()}_` : '';
          objJson = `${objJson}"${patt}${ky}":"${tx[ky]}",`;
        }

      }
    });
    return objJson;
  }

  DownloadExcel() {
    this.tblArrayExcel = [];
    const objlist: string[] = [];
    console.log("Descarga", this.dataSource.filteredData);
    this.dataSource.filteredData.forEach((tx: any) => {
      let _objJson = `{`;
      _objJson = this.getPlaneObject(tx, '', _objJson);
      _objJson = _objJson.substring(0, _objJson.length - 1);
      _objJson = `${_objJson} }`;
      objlist.push(JSON.parse(_objJson));
    });

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(objlist);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tablero Operativo');
    if (this.tblArrayExcel && this.tblArrayExcel.length > 0) {
      ws = XLSX.utils.json_to_sheet(this.tblArrayExcel);
      XLSX.utils.book_append_sheet(wb, ws, 'Detalle Tablero Operativo');
    }

    XLSX.writeFile(
      wb,
      `Tablero_Op.-${new Date().toDateString()} ${new Date().getTime()}.csv`
    );
  }

  applyFilter(event: Event) {
    this.showLoad = true;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.showLoad = false;
  }

  search() {
    this.showLoad = true;
    if (this.dateRange.value.start===null || this.dateRange.value.end===null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Aviso!',
        text: 'Falta alguna de las fechas para generar el rango.',
        heightAuto: false,
        confirmButtonText: 'ACEPTAR',
        allowOutsideClick: false
      });
    }
    if(this.dateRange.value.start===null && this.dateRange.value.end===null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Aviso!',
        text: 'Debe ingresar un rango antes de filtrar.',
        heightAuto: false,
        confirmButtonText: 'ACEPTAR',
        allowOutsideClick: false
      });
    }
    if (this.dateRange.value.start && this.dateRange.value.end) {
      const dateStart = moment(this.dateRange.value.start).format('YYYY-MM-DD');
      const dateEnd = moment(this.dateRange.value.end).format('YYYY-MM-DD');
      this.dataSource = new MatTableDataSource<DatosDeSalida>(this.dataInfo.filter((x: any) => moment(x.fechaContable).format('YYYY-MM-DD') >= dateStart && moment(x.fechaContable).format('YYYY-MM-DD') <= dateEnd));
      this.dataSource.paginator = this.paginator;
    }
    this.showLoad = false;
  }

  clean() {
    this.showLoad = true;
    this.dataSource = new MatTableDataSource<DatosDeSalida>(this.dataInfo);
    this.dataSource.paginator = this.paginator;
    this.dateRange.reset();
    this.showLoad = false;
  }

  async fillDataPage(){
    const dataOper = await this.boardService.getInfoTablero().toPromise().catch((err) =>{
      return err;
    });
    if(dataOper.notificaciones[0].notificacion !== this.codeResponse.RESPONSE_CODE_MESSAGE_200) {
      this.messageError.showMessageError(dataOper.message, dataOper.code);
    }
    else{
      this.dataInfo = dataOper.datosDeSalida.tableroCifras;
      this.dataHeader= [dataOper.datosDeSalida.operaciones];
      this.dateRange.reset();
      this.onLoadTable(this.dataInfo,this.dataHeader);
    }
  }

}

