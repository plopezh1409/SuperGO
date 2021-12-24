import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import Swal from 'sweetalert2';
import { UpdateModalMonetizationComponent } from '../update-modal-monetization/update-modal-monetization.component';

@Component({
  selector: 'app-table-monetization',
  templateUrl: './table-monetization.component.html',
  styleUrls: ['./table-monetization.component.sass']
})
export class TableMonetizationComponent implements OnInit {

  @Input()dataInfo:Monetizacion[];
  dataSource:MatTableDataSource<Monetizacion>;
  displayedColumns: string[] = ['sociedad', 'operacion', 'subOperacion', 'monetizacion','fechaDeInicioDeVigencia','','options', 'options2'];
  totalRows:number = 0;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Monetizacion>();    
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  open(){
    this.refData?.open(UpdateModalMonetizationComponent)
  }

  onLoadTable(dataInfo:Monetizacion[])  
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
    let titulos:string[]=["Sociedad","Operación","Sub-Operación","Monetización","Segmento","Monto de Monetización","Porcentaje","Fijo","Unidades","Tipo De Impuesto","Divisa","Emisión De Factura","Cobro/Pago","Corte","Fecha De Inicio De Vigencia","Fecha De Fin De Vigencia"]

    registro = registro.concat('<table class="tableInfoDel">');    
    keys.forEach((k,index) => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td>${titulos[index]}</td><td>${element[k]}</td></tr>`);            
      }      
    });
    registro = registro.concat('</table>');    
    Swal.fire({             
      html:`<div class="titModal"> Datos de la monetizacion </div><br/> <br/>${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }

}
