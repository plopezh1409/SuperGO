import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
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
  auxForm:any;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Operaciones>();
   }

  ngOnInit(): void {
    if(this.dataInfo.length !== 0)
      this.onLoadTable(this.dataInfo, this.auxForm);
  }

  onLoadTable(dataInfo:any, auxForm:any)  
  {
    console.log("onLoadTable");
    this.auxForm = auxForm;
    this.dataChanel = dataInfo.canal;
    this.dataInfo=dataInfo.tipoOperacion;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

open(element:any){
    let dialogRef:any = this.refData?.open(UpdateModalOperationsComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element),
        dataChanel:this.dataChanel,
        auxForm:this.auxForm
      }
    });
    dialogRef.afterClosed().subscribe((oData:any)=>{
      if(oData.status === true){
        this.dataInfo = oData.data.response;
        let auxForm = JSON.parse(JSON.stringify(oData.data.response));
        this.onLoadTable(this.dataInfo, auxForm);
      }
    });
    
  }

  show(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';
    let titulos:string[]=["IdSociedad","Descripción","Canal","Tópico KAFKA","Estatus"]
    registro = registro.concat('<table class="tableInfoDel"  style="font-size: 17px;">');    
    keys.forEach((k,index) => {
      if(index != 0)
        if(k!='Options')
        {   
          registro = registro.concat(`<tr><td><b>${titulos[index]}</b></td><td>${element[k]}</td></tr>`);            
        }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;" >Datos de la operación </div><br/> ${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) { }
    });
  }

}

