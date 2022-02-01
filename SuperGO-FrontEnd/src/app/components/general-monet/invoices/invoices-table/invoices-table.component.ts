import { animate, state, style, transition, trigger } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import Swal from 'sweetalert2';
import { UpdateModalInvoicesComponent } from '../update-modal-invoices/update-modal-invoices.component';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class invoicesTableComponent implements OnInit {

  @Input()dataInfo:Facturas[];
  dataSource:MatTableDataSource<Facturas>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipoOperacion','descSubTipoOperacion', 'idReglaMonetizacion','tipoComprobante','tipoFactura','options', 'options2'];
  totalRows:number = 0;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Facturas>();
    this.pageEvent= new PageEvent();   
   }

  ngOnInit(): void {
    if(this.dataInfo.length !== 0)
      this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:any)  
  {
    console.log("onLoadTable");
    this.dataInfo=dataInfo.facturas;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);
    this.totalRows = this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(element:any){
    return( this.refData?.open(UpdateModalInvoicesComponent,{
      data:{
        dataModal:element,
        keys:Object.keys(element)
      }
    }));
   
  }






  show(element:any):void{
    var oElement = Object.assign({} , element);
    delete oElement.idSociedad;
    delete oElement.idTipoOperacion;
    delete oElement.idSubTipoOperacion
    let keys = Object.keys(oElement);
    let registro:string='';
    let titulos:string[]=["Sociedad","Operación","Sub-Operación","Monetización","Tipo Comprobante","Tipo Factura"]
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
    keys.forEach((k,index) => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>${titulos[index]}</b></td><td style="padding:5px">${oElement[k]}</td></tr>`);            
      }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> Datos de la empresa </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    }).then(result=>{
      if (result.isConfirmed) {}
    });
  }

}
