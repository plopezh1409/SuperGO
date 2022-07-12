import { Component, Input, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

//MATERIAL
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

//COMPONENTS
import { UpdateModalOperationsComponent } from '../update-modal-operations/update-modal-operations.component';

//MODELS
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import { Container } from '@app/core/models/capture/container.model';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { Sort } from '@angular/material/sort';
import { SortModule } from '@app/shared/sort/sort.module';
import moment from 'moment';

@Component({
  selector: 'app-operations-table',
  templateUrl: './operations-table.component.html',
  styleUrls: ['./operations-table.component.sass']
})

export class OperationsTableComponent implements OnInit {

  @Input()dataInfo:Operaciones[];
  private readonly sortModule: SortModule;
  private startRow: string;
  private endRow: string;
  public dataSource:MatTableDataSource<Operaciones>;
  public displayedColumns: string[] = ['descripcionTipo', 'descripcionCanal', 'topicoKafka', 'status',  'usuario' ,'fecha','options', 'options2'];
  public totalRows:number;
  public containers:Container[];

  @ViewChild(MatPaginator)  paginator!: MatPaginator;

  constructor(public refData?:MatDialog) {
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<Operaciones>();
    this.sortModule = new SortModule;
    this.startRow = '<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>';
    this.endRow = '</b></td><td style="padding:5px">';
   }

  ngOnInit(): void {
    if (this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo);
    }
  }

  onLoadTable(dataInfo:Operaciones[])
  {
    this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo = this.getDesCanal(dataInfo);
    this.dataSource = new MatTableDataSource<Operaciones>(this.dataInfo);
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    let sortedData:Operaciones[] = this.dataInfo;
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
          case 'topicoKafka':
            return this.sortModule.compare(a.topicoKafka, b.topicoKafka, isAsc);
          case 'descripcionTipo':
            return this.sortModule.compare(a.descripcionTipo, b.descripcionTipo, isAsc);
          case 'idCanal':
            return this.sortModule.compare(a.idCanal, b.idCanal, isAsc);
          case 'usuario':
            return this.sortModule.compare(a.usuario, b.usuario, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource = new MatTableDataSource<Operaciones>(sortedData);
  }

open(obOperation:Operaciones){
  return(
    this.refData?.open(UpdateModalOperationsComponent,{
      width: '70%',
      data:{
        dataModal:obOperation,
        auxForm:this.containers
      }
    }).afterClosed().subscribe((oData:ResponseTable)=>{
      if(oData !== undefined && oData.status === true){
        this.dataInfo = oData.data;
        this.onLoadTable(this.dataInfo);
      }
    })
  );
  }

  show(obOperation:Operaciones):void{
    const status = obOperation.status === 'A'? 'ACTIVO' : 'INACTIVO';
    let registro = '';
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom:
    2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td
    style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
    registro = registro.concat(`${this.startRow} Descripción ${this.endRow} ${obOperation.descripcionTipo} </td></tr>`);
    registro = registro.concat(`${this.startRow} Topíco Kafka ${this.endRow}  ${obOperation.topicoKafka} </td></tr>`);
    registro = registro.concat(`${this.startRow} Canal ${this.endRow}  ${obOperation.descripcionCanal} </td></tr>`);
    registro = registro.concat(`${this.startRow} Estatus ${this.endRow}  ${status} </td></tr>`);
    registro = registro.concat(`${this.startRow} Ultima Modificación ${this.endRow}</td></tr>`);
    registro = registro.concat(`${this.startRow} Usuario ${this.endRow}  ${obOperation.usuario} </td></tr>`);
    registro = registro.concat(`${this.startRow} Fecha  ${this.endRow}  ${obOperation.fecha} </td></tr>`);
    Swal.fire({
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;">
      Datos de la Operación </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    });
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

  getDesCanal(dataInfo:Operaciones[]) : Operaciones[]
  {
    dataInfo.forEach( (x:Operaciones) => {
      x.descripcionCanal = x.idCanal === 1 ? 'MONETIZADOR' : 'CANAL SUPER APP' ;
    });
    return dataInfo;
  }

}

