import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-catalogo',
  templateUrl: './tabla-catalogo.component.html',
  styleUrls: ['./tabla-catalogo.component.sass']
})
export class TablaCatalogoComponent implements OnInit {
  @Input()dataInfo:Sociedad[];
  dataSource:MatTableDataSource<Sociedad>;
  displayedColumns: string[] = ['razonSocial', 'rfc', 'tipoDeSociedad', 'options'];
  totalRows:number = 0;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor() {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Sociedad>();    
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:Sociedad[])  
  {
    console.log("onLoadTable");
    this.dataInfo=dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  eliminar(element:any):void{
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
      html:`<div class="titModal">Eliminar Registro</div><br/>¿Estás seguro de eliminar el siguiente registro? <br/>${registro}`,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText:'Cancelar',
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }


  

}
