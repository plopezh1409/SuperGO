import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import Swal from 'sweetalert2';
import { UpdateModalSocietiesComponent } from '../update-modal-societies/update-modal-societies.component';
//SERVICES
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';

@Component({
  selector: 'app-societies-table',
  templateUrl: './societies-table.component.html',
  styleUrls: ['./societies-table.component.sass']
})

export class SocietiesTableComponent implements OnInit {
  dataInfo:Sociedad[];
  dataSource:MatTableDataSource<Sociedad>;
  displayedColumns: string[] = ['razonSocial', 'rfc', 'descripcionTipoSociedad', 'options', 'options2'];
  totalRows:number = 0;
  containers:any;
  angularSecurity:AngularSecurity;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private injector:Injector, public refData?:MatDialog) {    
    this.dataInfo=[];
    this.dataSource = new MatTableDataSource<Sociedad>();
    this.angularSecurity = this.injector.get<AngularSecurity>(AngularSecurity);
   }

  ngOnInit(): void {     
    if(this.dataInfo.length !== 0)
      this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:any)  
  {
    var auxForm:any = localStorage.getItem("_auxForm");
    this.containers = JSON.parse(auxForm);
    this.dataInfo = dataInfo.sociedades;
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(element:any){
    return( this.refData?.open(UpdateModalSocietiesComponent,{
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
    }));
  }

  show(element:any):void{
    var oElement = Object.assign({} , element);
    delete oElement.idSociedad;
    delete oElement.idTipoSociedad;
    let keys = Object.keys(oElement);
    let registro:string='';
    let titulos:string[]=["Razón Social","RFC","Tipo De Sociedad"]
     
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

