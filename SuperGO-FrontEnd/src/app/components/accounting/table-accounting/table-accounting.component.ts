import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import Swal from 'sweetalert2';
import { UpdateModalAccountingComponent } from '../update-modal-accounting/update-modal-accounting.component';

@Component({
  selector: 'app-table-accounting',
  templateUrl: './table-accounting.component.html',
  styleUrls: ['./table-accounting.component.sass']
})
export class TableAccountingComponent implements OnInit {

  @Input()dataInfo:Contabilidad[];
  dataSource:MatTableDataSource<Contabilidad>;
  displayedColumns: string[] = ['sociedad', 'operacion', 'subOperacion', 'monetizacion','contabilidadDiaria','numeroDeApunte','options', 'options2'];
  totalRows:number = 0;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Contabilidad>();    
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  open(){
    this.refData?.open(UpdateModalAccountingComponent)
  }

  onLoadTable(dataInfo:Contabilidad[])  
  {
    console.log("onLoadTable");
    this.dataInfo=dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
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
      html:`<div class="titModal"> Datos de la contabilidad </div><br/> <br/>${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }
}
