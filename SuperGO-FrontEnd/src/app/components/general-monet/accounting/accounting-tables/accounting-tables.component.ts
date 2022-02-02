import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import Swal from 'sweetalert2';
import { UpdateModalAccountingComponent } from '../update-modal-accounting/update-modal-accounting.component';

@Component({
  selector: 'app-accounting-tables',
  templateUrl: './accounting-tables.component.html',
  styleUrls: ['./accounting-tables.component.sass']
})

export class AccountingTablesComponent implements OnInit {

  @Input()dataInfo:Contabilidad[];
  dataSource:MatTableDataSource<Contabilidad>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipoOperacion', 'descSubTipoOperacion', 'descripcionReglaMonetizacion','fechaInicioVigencia','fechaFinVigencia','options', 'options2'];
  totalRows:number = 0;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Contabilidad>();
    this.pageEvent= new PageEvent();   
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  open(){
    return(
      this.refData?.open(UpdateModalAccountingComponent)
    );
   
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
    let titulos:string[]=["Sociedad","Operación","Sub-Operación","Monetización","Contabilidad Diaria","Número De Apunte","Sociedad GL","Tipo Cuenta","Cuenta SAP","Clase Documento","Concepto","Centro Destino","IVA","Cargo/Abono","Fecha Inicio De Vigencia","Fecha Fin De Vigencia"]
     
    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach((k,index) => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td>${titulos[index]}</td><td>${element[k]}</td></tr>`);            
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
