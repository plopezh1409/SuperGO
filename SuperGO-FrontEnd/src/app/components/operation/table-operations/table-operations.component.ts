import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import Swal from 'sweetalert2';
import { UpdateModalOperationComponent } from '../update-modal-operation/update-modal-operation.component';

@Component({
  selector: 'app-table-operations',
  templateUrl: './table-operations.component.html',
  styleUrls: ['./table-operations.component.sass']
})
export class TableOperationsComponent implements OnInit {

  @Input()dataInfo:Operaciones[];
  dataSource:MatTableDataSource<Operaciones>;
  displayedColumns: string[] = ['descripcionTipoOperacion', 'idCanal', 'topicoKafka', 'status','options', 'options2'];
  totalRows:number = 0;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Operaciones>();    
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:Operaciones[])  
  {
    console.log("onLoadTable");
    this.dataInfo=dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

open(element:any){
    this.refData?.open(UpdateModalOperationComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element)
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
