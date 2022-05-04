import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import Swal from 'sweetalert2';
import { UpdateModalSocietiesComponent } from '../update-modal-societies/update-modal-societies.component';
//SERVICES
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { ResponseTable } from '@app/core/models/responseGetTable/responseGetTable.model';
import { ReportsModule } from '@app/shared/reports/reports.module';
import { Sort } from '@angular/material/sort';
import { SortModule } from '@app/shared/sort/sort.module';
import moment from 'moment';

@Component({
  selector: 'app-societies-table',
  templateUrl: './societies-table.component.html',
  styleUrls: ['./societies-table.component.sass']
})

export class SocietiesTableComponent implements OnInit {
  dataInfo:Sociedad[];
  dataSource:MatTableDataSource<Sociedad>;
  displayedColumns: string[] = ['idProveedorSAP', 'razonSocial', 'rfc', 'descripcionTipo', 'codigoPostal' ,'usuario' ,'fecha', 'options', 'options2'];
  totalRows:number;
  containers:Container[];
  report: ReportsModule;
  sortModule: SortModule;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private readonly injector:Injector, public refData?:MatDialog) {    
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<Sociedad>();
    this.report = new ReportsModule();
    this.sortModule = new SortModule;
   }

  ngOnInit(): void {     
    if(this.dataInfo.length !== 0){
      this.onLoadTable(this.dataInfo);
    }
  }

  onLoadTable(dataInfo:Sociedad[])  
  {
    this.containers = JSON.parse(localStorage.getItem('_auxForm') || '');
    this.dataInfo = dataInfo;
    this.dataSource = new MatTableDataSource<Sociedad>(this.dataInfo);  
    this.totalRows = this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    let sortedData:Sociedad[] = this.dataInfo;
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
          case 'idProveedorSAP':
            return this.sortModule.compare(a.idProveedorSAP, b.idProveedorSAP, isAsc);
          case 'razonSocial':
            return this.sortModule.compare(a.razonSocial, b.razonSocial, isAsc);
          case 'descripcionTipo':
            return this.sortModule.compare(a.descripcionTipo, b.descripcionTipo, isAsc);
          case 'rfc':
            return this.sortModule.compare(a.rfc, b.rfc, isAsc);
          case 'codigoPostal':
            return this.sortModule.compare(a.codigoPostal, b.codigoPostal, isAsc);
          case 'usuario':
            return this.sortModule.compare(a.usuario, b.usuario, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource = new MatTableDataSource<Sociedad>(sortedData);
  }

  open(oSociedad:Sociedad){
    return( this.refData?.open(UpdateModalSocietiesComponent,{
      width: '70%',
      data:{
        dataModal:oSociedad,
        auxForm:this.containers
      }
    }).afterClosed().subscribe((oData:ResponseTable)=>{
      if(oData !== undefined && oData.status === true){
        this.dataInfo = oData.data;
        this.onLoadTable(this.dataInfo);
      }
    }));
  }

  show(oSociedad:Sociedad):void{
    let registro='';
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 
    2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  
    style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Razón Social </b></td><td style="padding:5px">  ${oSociedad.razonSocial} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    RFC </b></td><td style="padding:5px">  ${oSociedad.rfc} </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Tipo De Sociedad </b></td><td style="padding:5px">  ${oSociedad.descripcionTipo} </td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Código Postal </b></td><td style="padding:5px">  ${oSociedad.codigoPostal} </td></tr>`);

    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Ultima Modificación </b></td><td style="padding:5px"></td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Usuario </b></td><td style="padding:5px">  ${oSociedad.usuario} </td></tr>`);  
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Fecha </b></td><td style="padding:5px">  ${oSociedad.fecha} </td></tr>`);  	
    Swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> 
      Datos de la Sociedad </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    });
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

  createReport(){
    const headers =['Razon Social','RFC','Tipo Sociedad','Codigo Postal','Ultima Modif. Usuario','Ultima Modificacion'];
    const dataReporting = this.dataInfo.map((data:Sociedad) => {
      let obj = Object.assign(data);
      delete obj.idSociedad;
      delete obj.idTipo;
      return obj;
    });
    this.report.descargarExcel('Sociedades', dataReporting, headers);
  }

}