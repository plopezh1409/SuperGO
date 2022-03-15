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

@Component({
  selector: 'app-societies-table',
  templateUrl: './societies-table.component.html',
  styleUrls: ['./societies-table.component.sass']
})

export class SocietiesTableComponent implements OnInit {
  dataInfo:Sociedad[];
  dataSource:MatTableDataSource<Sociedad>;
  displayedColumns: string[] = ['razonSocial', 'RFC', 'descripcionTipoSociedad', 'options', 'options2'];
  totalRows:number;
  containers:Container[];

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private injector:Injector, public refData?:MatDialog) {    
    this.dataInfo=[];
    this.containers = [];
    this.totalRows = 0;
    this.dataSource = new MatTableDataSource<Sociedad>();
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
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(oSociedad:Sociedad){
    return( this.refData?.open(UpdateModalSocietiesComponent,{
      width: '70%',
      data:{
        dataModal:oSociedad,
        auxForm:this.containers
      }
    }).afterClosed().subscribe((oData:ResponseTable)=>{
      if(oData !== undefined)
        if(oData.status === true){
          this.dataInfo = oData.data;
          this.onLoadTable(this.dataInfo);
        }
    }));
  }

  show(oSociedad:Sociedad):void{
    let registro:string=''; 
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 
    2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  
    style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Razón Social </b></td><td style="padding:5px"> `+ oSociedad.razonSocial +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    RFC </b></td><td style="padding:5px"> `+ oSociedad.RFC +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> 
    Tipo De Sociedad </b></td><td style="padding:5px"> `+ oSociedad.descripcionTipoSociedad +` </td></tr>`);            
    Swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> 
      Datos de la contabilidad </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    });
  }

  ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

}

