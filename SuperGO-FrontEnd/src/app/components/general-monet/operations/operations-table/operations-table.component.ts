import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import Swal from 'sweetalert2';
import { UpdateModalOperationsComponent } from '../update-modal-operations/update-modal-operations.component';

@Component({
  selector: 'app-operations-table',
  templateUrl: './operations-table.component.html',
  styleUrls: ['./operations-table.component.sass']
})

export class OperationsTableComponent implements OnInit {

  @Input()dataInfo:Operaciones[];
  dataSource:MatTableDataSource<Operaciones>;
  displayedColumns: string[] = ['descripcionTipoOperacion', 'idCanal', 'topicoKafka', 'status','options', 'options2'];
  totalRows:number = 0;
  dataChanel:any=[];

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Operaciones>();    
   }

  ngOnInit(): void {
    if(this.dataInfo.length !== 0)
      this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:any)  
  {
    console.log("onLoadTable");
    // dataInfo:Operaciones[] = 
    this.dataChanel = dataInfo.canales;
    this.dataInfo=dataInfo.operaciones;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

open(element:any){
    this.refData?.open(UpdateModalOperationsComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element),
        dataChanel:this.dataChanel
      }
    })
  }






  show(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';
    let titulos:string[]=["Descripción","Canal","Tópico KAFKA","Estatus"]
     
    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach((k,index) => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td>${titulos[index]}</td><td>${element[k]}</td></tr>`);            
      }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal"> Datos de la operación </div><br/> <br/>${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }
}

