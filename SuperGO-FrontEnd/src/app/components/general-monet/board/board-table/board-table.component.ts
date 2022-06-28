import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatosDeSalida, Tablero } from '@app/core/models/board/board.model';
import Swal from 'sweetalert2';
//SERVICES
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-board-table',
  templateUrl: './board-table.component.html',
  styleUrls: ['./board-table.component.sass']
})

export class BoardTableComponent implements OnInit {
  private tblArrayExcel:string[];
  dataInfo:DatosDeSalida[];
  dataHeader:Tablero[];
  dataSource:MatTableDataSource<DatosDeSalida>;
  dataSourceHeader:MatTableDataSource<Tablero>;
  displayedColumnsHeader: string[] = ['idTipo', 'idSubtipo', 'descripcionTipo'];
  displayedColumns: string[] = [ 'FECHA_DE_OPERACION', 'numeroOperaciones', 'montoOperaciones', 'numeroOperaciones2', 'montoOperaciones2', 'montoMonetizacion', 'iva', 'montoTotal', 'fechaCorte', 'semana', 'razonSocial', 'documentoContable', 'fechaContable', 'cuentaBalance', 'montoBalance', 'cuentaResultados', 'montoResultados','options'];
  totalRows:number;
  containers:Container[];

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private readonly injector:Injector, public refData?:MatDialog) {   
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<DatosDeSalida>();
    this.tblArrayExcel=[];
    this.dataHeader=[];
    this.dataSourceHeader= new MatTableDataSource<Tablero>();
   }

  ngOnInit(): void {     
    if(this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo,this.dataHeader);
    }
  }

  onLoadTable(dataInfo:DatosDeSalida[],dataHeader:Tablero[])  
  {
    // this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo = dataInfo;
    this.dataSource = new MatTableDataSource<DatosDeSalida>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;

    this.dataHeader = dataHeader;
    this.dataSourceHeader = new MatTableDataSource<Tablero>(this.dataHeader);  
  }

  open(oSociedad:DatosDeSalida){
    // return( this.refData?.open(UpdateModalSocietiesComponent,{
    //   width: '70%',
    //   data:{
    //     dataModal:oSociedad,
    //     auxForm:this.containers
    //   }
    // }).afterClosed().subscribe((oData:ResponseTable)=>{
    //   if(oData !== undefined && oData.status === true){
    //     this.dataInfo = oData.data;
    //     this.onLoadTable(this.dataInfo);
    //   }
    // }));
  }

  show(oTablero:Tablero):void{
    let encabezado='';
    let registro='';
    let detalleSuma='';

    encabezado = encabezado.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    encabezado = encabezado.concat('<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>ID MONETIZACION</b></td>');
    encabezado = encabezado.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>TIPO OPERACION</b></td>');
    encabezado = encabezado.concat('<td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b>DESCRIPCION TIPO</b></td></tr>');
    this.dataHeader.map(row => {
      encabezado = encabezado.concat(`<tr><td style=":20%; padding:5px; text-align:center;">${row.idTipo}</td><td style="width:20%; padding:5px; text-align:center;">${row.idSubtipo}</td><td style="width:20%; padding:5px; text-align:center;">${row.descripcionTipo}</td></tr>`);
    })
    encabezado = encabezado.concat(`</table>`);
   

    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 
    2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  
    style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    FECHA OPERACION </b></td><td style="padding:5px"> ${oTablero.fechaOperacion } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px text-align:center"><b> 
    NUMERO DE OPERACIONES </b></td><td style="padding:5px"> ${oTablero.numeroOperaciones } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center> <b> 
    MONTO DE OPERACIONES </b></td><td style="padding:5px"> ${oTablero.montoOperaciones } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center> <b> 
    NUMERO DE OPERACIONES </b></td><td style="padding:5px"> ${oTablero.numeroOperaciones } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO DE OPERACIONES </b></td><td style="padding:5px"> ${oTablero.montoOperaciones } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO DE MONETIZACION </b></td><td style="padding:5px"> ${oTablero.montoMonetizacion } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    IVA </b></td><td style="padding:5px"> ${oTablero.iva } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO TOTAL </b></td><td style="padding:5px"> ${oTablero.montoTotal } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    FECHA DE CORTE </b></td><td style="padding:5px"> ${oTablero.fechaContable } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    SEMANA </b></td><td style="padding:5px"> ${oTablero.semana } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    RAZON SOCIAL </b></td><td style="padding:5px"> ${oTablero.razonSocial } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    DOCUMENTO CONTABLE </b></td><td style="padding:5px"> ${oTablero.documentoContable } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    FECHA CONTABLE </b></td><td style="padding:5px"> ${oTablero.fechaContable } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    CUENTA BALANCE </b></td><td style="padding:5px"> ${oTablero.cuentaBalance } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO BALANCE </b></td><td style="padding:5px"> ${oTablero.montoBalance } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    CUENTA RESULTADOS </b></td><td style="padding:5px"> ${oTablero.cuentaResultados } </td></tr>`); 
     registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px" text-align:center><b> 
    MONTO RESULTADOS </b></td><td style="padding:5px"> ${oTablero.montoResultados } </td></tr></table>`);          
    
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
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> 
      DATOS DEL TABLERO OPERATIVO ${encabezado} <br/> ${registro} <br/> ${detalleSuma} </div>`,
      showCancelButton: false,
      width: '50%'
    });
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

  getPlaneObject(tx: any, pattern: string, objJson: string) {
   
    Object.keys(tx).forEach((ky) => {      
      if (typeof tx[ky] === 'object') {
        if(Array.isArray(tx[ky]))
        {       
          debugger;     
          tx[ky].forEach((x:any)=>{
            debugger; 
            if(typeof x === 'object')
            {
              this.tblArrayExcel.push(Object.assign({},tx,x));
            }                        
          });                          
        }
        else
        {
          debugger; 
          pattern = ky;
          objJson = `${this.getPlaneObject(tx[ky], pattern, objJson)}`;
        }        
      } 
      else {  
        debugger;       
        if(ky != 'estatusContabilizacion')
        {
          const patt = pattern.trim().length > 0 ? `${pattern.trim()}_` : '';
          objJson = `${objJson}"${patt}${ky}":"${tx[ky]}",`;   
        }
            
      }
    });
    return objJson;
  }

 DownloadExcel() {
    this.tblArrayExcel=[];
    const objlist: string[] = [];   
    
    this.dataInfo.forEach((tx: any) => {
      let _objJson = `{`;
      _objJson = this.getPlaneObject(tx, '', _objJson);
      _objJson = _objJson.substring(0, _objJson.length - 1);
      _objJson = `${_objJson} }`;
      objlist.push(JSON.parse(_objJson));      
    });
    
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(objlist);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tablero Operativo');
    if(this.tblArrayExcel && this.tblArrayExcel.length>0)
    {
      ws = XLSX.utils.json_to_sheet(this.tblArrayExcel);
      XLSX.utils.book_append_sheet(wb, ws, 'Detalle Tablero Operativo');
    }

    XLSX.writeFile(
      wb,
      `Tablero_Op.-${new Date().toDateString()} ${new Date().getTime()}.xlsx`
    );
  }

}

