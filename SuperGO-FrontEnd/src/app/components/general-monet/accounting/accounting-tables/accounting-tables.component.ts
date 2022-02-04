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
  containers:any;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(public refData?:MatDialog) {    
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Contabilidad>();
    this.pageEvent= new PageEvent();   
   }

  ngOnInit(): void {     
    this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:Contabilidad[])  
  {
    console.log("onLoadTable");
    var auxForm:any = localStorage.getItem("_auxForm");
    this.containers = JSON.parse(auxForm);
    this.dataInfo=dataInfo;  
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(element:any){
    let oEle = Object.assign({}, element);
    delete oEle.razonSocial;
    delete oEle.descripcionTipoOperacion
    delete oEle.descSubTipoOperacion
    delete oEle.descripcionReglaMonetizacion
    delete oEle.fechaInicioVigencia
    delete oEle.fechaFinVigencia
    oEle.contabilidadDiaria = oEle.contabilidadDiaria == "D"?"true":"false";
    oEle.indicadorIva = oEle.indicadorIva == "AA"?"true":"false";
    oEle.indicadorOperacion = oEle.indicadorOperacion == "C"?"true":"false";
    var _auxForm = this.disabledFieldSociety(this.containers);
    return( this.refData?.open(UpdateModalAccountingComponent,{
      data:{
        dataModal:oEle,
        keys:Object.keys(oEle),
        auxForm:_auxForm
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
    delete oElement.idReglaMonetizacion;
    delete oElement.idSubTipoOperacion;
    delete oElement.idTipoOperacion;
    oElement.contabilidadDiaria = oElement.contabilidadDiaria == "true"?"CONTABILIDAD DIARIA":"CONTABILIDAD AL CORTE";
    oElement.indicadorIva = oElement.indicadorIva == "true"?"APLICA IVA":"NO APLICA IVA";
    oElement.indicadorOperacion = oElement.indicadorOperacion == "true"?"CARGO":"ABONO";
    
    let keys = Object.keys(oElement);
    let registro:string='';

    let titulos:string[]=["Sociedad","Operación","Sub-Operación", "Contabilidad Diaria","Número de Apunte","Sociedad GL", "Tipo de Cuenta", "Indicador de Operación","Clase de Documento","Concepto","Centro Destino","IVA","Cuenta SAP","Monetización","Fecha Inicio De Vigencia","Fecha Fin De Vigencia"]
     
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);            
      keys.forEach((k,index) => {
      if(k!='Options')
      {   
        registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b>${titulos[index]}</b></td><td style="padding:5px">${oElement[k]}</td></tr>`);            
      }      
    });
    Swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> Datos de la contabilidad </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    }).then(result=>{
      if (result.isConfirmed) {}
    });
  }

  disabledFieldSociety(_auxForm:any){
    let element:any; let ctrl:any;
    for(element of _auxForm)
      for(ctrl of element.controls) 
        if(ctrl.ky === 'sociedad'){
          ctrl.disabled = true;
          break;
        }
    return _auxForm;
  }

}
