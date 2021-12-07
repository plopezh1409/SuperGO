import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-operations',
  templateUrl: './table-operations.component.html',
  styleUrls: ['./table-operations.component.sass']
})
export class TableOperationsComponent implements OnInit {

  @Input()dataInfo:Operaciones[];
  dataSource:MatTableDataSource<Operaciones>;
  displayedColumns: string[] = ['descripcion', 'canal', 'topicoKafka', 'estatus','options', 'options2'];
  totalRows:number = 0;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor() {    
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

 


  update(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';    
    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach(k => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td>${k}</td><td>${element[k]}</td></tr>`);                    
      }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal">Actualizar Registro</div><br/>¿Estás seguro de actualizar el siguiente registro? <br/>${registro}`,
      showCancelButton: true,
      confirmButtonText: `Actualizar`,
      cancelButtonText:'Cancelar',
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }



  show(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';
     
    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach(k => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td>${k}</td><td>${element[k]}</td></tr>`);            
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
