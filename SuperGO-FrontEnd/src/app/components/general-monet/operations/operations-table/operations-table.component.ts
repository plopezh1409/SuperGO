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
  containers:any;
  
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Operaciones>();
   }

  ngOnInit(): void {
    if (this.dataInfo.length !== 0)
      this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:any)  
  {
    var auxForm:any = localStorage.getItem("_auxForm");
    this.containers = JSON.parse(auxForm);
    this.dataInfo=dataInfo.tipoOperacion;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

open(element:any){
  return(
    this.refData?.open(UpdateModalOperationsComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element),
        auxForm:this.containers
      }
    }).afterClosed().subscribe((oData:any)=>{
      if(oData !== undefined)
        if(oData.status === true){
          this.dataInfo = oData.data;
          this.onLoadTable(this.dataInfo);
        }
    })
  );
   
  }

  show(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';
    let titulos:string[]=["IdSociedad","Descripción","Canal","Tópico KAFKA","Estatus"]
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');    
    keys.forEach((k,index) => {
      if(index != 0)
        if(k!='Options')
        {   
          registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:20%; padding:5px"><b>${titulos[index]}</b></td><td style="padding:5px">${element[k]}</td></tr>`);            
        }      
    });
    registro = registro.concat('</table>');
    Swal.fire({             
      html: `<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;" >Datos de la operación </div><br/> ${registro}`,
      showCancelButton: false,
      width: '60%'
    }).then(result=>{
      if (result.isConfirmed) { }
    });
  }

}

