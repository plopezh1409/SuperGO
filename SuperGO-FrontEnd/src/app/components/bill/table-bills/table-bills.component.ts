import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateModalCatalogsComponent } from '@app/components/catalogs/update-modal-catalogs/update-modal-catalogs.component';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import Swal from 'sweetalert2';
import { UpdateModalBillComponent } from '../update-modal-bill/update-modal-bill.component';

@Component({
  selector: 'app-table-bills',
  templateUrl: './table-bills.component.html',
  styleUrls: ['./table-bills.component.sass']
})
export class TableBillsComponent implements OnInit {

  @Input()dataInfo:Facturas[];
  dataSource:MatTableDataSource<Facturas>;
  displayedColumns: string[] = ['idSociedad', 'idTipoOperacion','idSubTipoOperacion', 'idReglaMonetizacion','tipoComprobante','tipoFactura','options', 'options2'];
  totalRows:number = 0;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Facturas>();    
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:Facturas[])  
  {
    console.log("onLoadTable");
    this.dataInfo=dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(element:any){
    this.refData?.open(UpdateModalBillComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element)
      }
    })
  }






  show(element:any):void{
    let keys = Object.keys(element);
    let registro:string='';
    let titulos:string[]=["Sociedad","Operación","Sub-Operación","Monetización","Tipo Comprobante","Tipo Factura"]
     
    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach((k,index) => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td>${titulos[index]}</td><td>${element[k]}</td></tr>`);            
      }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal"> Datos de la factura </div><br/> <br/>${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }


}
