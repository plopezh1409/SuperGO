import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import Swal from 'sweetalert2';
import { GeneralComponent } from '../general/general.component';
import { UpdateModalCatalogsComponent } from '../update-modal-catalogs/update-modal-catalogs.component';

@Component({
  selector: 'app-tabla-catalogo',
  templateUrl: './tabla-catalogo.component.html',
  styleUrls: ['./tabla-catalogo.component.sass']
})
export class TablaCatalogoComponent implements OnInit {
  dataInfo:Sociedad[];
  dataSource:MatTableDataSource<Sociedad>;
  displayedColumns: string[] = ['razonSocial', 'RFC', 'idTipoSociedad', 'options', 'options2'];
  totalRows:number = 0;
  

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Sociedad>();
   
   }

  ngOnInit(): void {     

  }

  onLoadTable(dataInfo:Sociedad[])  
  {
    console.log("onLoadTable");
    this.dataInfo=dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(element:any){
    this.refData?.open(UpdateModalCatalogsComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element)
      }
    })
  }
 




  show(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';
    let titulos:string[]=["IdSociedad","Razón Social","RFC","Tipo De Sociedad"]
     
    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach((k,index) => {
      if(index != 0)
        if(k!='Options')
        {   
          registro = registro.concat(`<tr><td>${titulos[index]}</td><td>${element[k]}</td></tr>`);            
        }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal"> Datos de la empresa </div><br/> <br/>${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) {      
        
      }
    });
  }


  

}
