import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';
import swal from 'sweetalert2';
import { UpdateModalMonetizationComponent } from '../update-modal-monetization/update-modal-monetization.component';

@Component({
  selector: 'app-monetization-table',
  templateUrl: './monetization-table.component.html',
  styleUrls: ['./monetization-table.component.sass']
})

export class MonetizationTableComponent implements OnInit {

  @Input()dataInfo:Monetizacion[];
  dataSource:MatTableDataSource<Monetizacion>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipoOperacion', 'descSubTipoOperacion', 'idReglaMonetizacion', 'fechaInicio','fechaFin','options', 'options2'];
  totalRows:number = 0;
  pageEvent: PageEvent;
  containers:any;
  monetService:FormMonetizationsService;
  private showLoad: boolean = false;
  private loaderDuration: number;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private injector:Injector,public refData?:MatDialog) { 
    this.monetService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Monetizacion>(); 
    this.pageEvent= new PageEvent();   
    this.loaderDuration = 100;   
   }

  ngOnInit(): void {    
    if(this.dataInfo.length !== 0) 
      this.onLoadTable(this.dataInfo);
  }

  onLoadTable(dataInfo:any)  
  {
    console.log("onLoadTable");
    var auxForm:any = localStorage.getItem("_auxForm");
    this.containers = JSON.parse(auxForm);
    this.dataInfo = dataInfo.reglasMonetizacion;
    this.dataSource = new MatTableDataSource<any>(this.dataInfo);  
    this.totalRows  =this.dataInfo.length;
    this.dataSource.paginator = this.paginator;
  }

  open(element:any){
    return(
      this.refData?.open(UpdateModalMonetizationComponent)
    );
   
  }

  // open(element:any){
  //   this.showLoader(true);
  //   this.monetService.getDataMonetizationById(element).pipe(finalize(() => { this.showLoader(false); })).
  //   subscribe((response:any) => {
  //     switch (response.code) {
  //       case 200: //Se modifico el registro correctamente
  //         this.showUpdateModalAccounting(response.response.registroContable);
  //         break;
  //       case 400: //Solicitud incorrecta
  //         swal.fire({
  //           icon: 'warning',
  //           title: 'Solicitud incorrecta',
  //           text: response.mensaje,
  //           heightAuto: false
  //         });
  //         break;
  //       case 401://No autorizado
  //         swal.fire({
  //           icon: 'warning',
  //           title: 'No autorizado',
  //           text: response.mensaje,
  //           heightAuto: false
  //         });
  //         break;
  //       case 500://Error Inesperado
  //         swal.fire({
  //           icon: 'error',
  //           title: 'Error inesperado',
  //           text: response.mensaje,
  //           heightAuto: false
  //         });
  //         break;
  //       default: break;
  //     }
  //   });
  // }

  

 




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
    swal.fire({             
      html:`<div class="titModal"> Datos de la monetizacion </div><br/> <br/>${registro}`,
      showCancelButton: false
    }).then(result=>{
      if (result.isConfirmed) {      
        
        
      }
    });
  }

  // show(element:Contabilidad):void{
  //   this.showLoader(true);
  //   this.accountService.getAccountingById(element).pipe(finalize(() => { this.showLoader(false); })).
  //   subscribe((response:any) => {
  //     switch (response.code) {
  //       case 200: //Se modifico el registro correctamente
  //         this.showAccounting(response.response.registroContable);
  //         break;
  //       case 400: //Solicitud incorrecta
  //         swal.fire({
  //           icon: 'warning',
  //           title: 'Solicitud incorrecta',
  //           text: response.mensaje,
  //           heightAuto: false
  //         });
  //         break;
  //       case 401://No autorizado
  //         swal.fire({
  //           icon: 'warning',
  //           title: 'No autorizado',
  //           text: response.mensaje,
  //           heightAuto: false
  //         });
  //         break;
  //       case 500://Error Inesperado
  //         swal.fire({
  //           icon: 'error',
  //           title: 'Error inesperado',
  //           text: response.mensaje,
  //           heightAuto: false
  //         });
  //         break;
  //       default: break;
  //     }
  //   });
  // }

  showAccounting(oConta:any)
  {
    oConta.contabilidadDiaria = oConta.contabilidadDiaria == "D"?"CONTABILIDAD DIARIA":"CONTABILIDAD AL CORTE";
    oConta.indicadorIVA = oConta.indicadorIVA == "AA"?"APLICA IVA":"NO APLICA IVA";
    oConta.indicadorOperacion = oConta.indicadorOperacion == "C"?"CARGO":"ABONO";
    let registro:string='';
    registro = registro.concat('<table class="tableInfoDel" cellspacing="0" cellpadding="0">');
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important;border-bottom: 2px solid black!important; width:20%; padding:5px; text-align:center;"><b><i>Datos<i></b></td><td  style="border-bottom: 2px solid black!important; padding:5px; text-align:center;"><b><i>Descripción</i></b></td></tr>`);
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Sociedad </b></td><td style="padding:5px"> `+ oConta.razonSocial +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Operación </b></td><td style="padding:5px"> `+ oConta.descripcionTipoOperacion +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Sub-Operación </b></td><td style="padding:5px"> `+ oConta.descSubTipoOperacion +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Contabilidad </b></td><td style="padding:5px"> `+ oConta.contabilidadDiaria +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Número de Apunte </b></td><td style="padding:5px"> `+ oConta.numeroApunte +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Sociedad GL </b></td><td style="padding:5px"> `+ oConta.sociedadGl +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Tipo de Cuenta </b></td><td style="padding:5px"> `+ oConta.tipoCuenta +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Indicador de Operación </b></td><td style="padding:5px"> `+ oConta.indicadorOperacion +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Clase de Documento </b></td><td style="padding:5px"> `+ oConta.claseDocumento +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Concepto </b></td><td style="padding:5px"> `+ oConta.concepto +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Centro Destino </b></td><td style="padding:5px"> `+ oConta.centroDestino +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> IVA </b></td><td style="padding:5px"> `+ oConta.indicadorIVA +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Cuenta SAP </b></td><td style="padding:5px"> `+ oConta.cuentaSAP +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Monetización </b></td><td style="padding:5px"> `+ oConta.idReglaMonetizacion +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Fecha Inicio De Vigencia </b></td><td style="padding:5px"> `+ oConta.fechaInicioVigencia +` </td></tr>`);            
    registro = registro.concat(`<tr><td style="border-right: 2px solid black!important; width:25%; padding:5px"><b> Fecha Fin De Vigencia </b></td><td style="padding:5px"> `+ oConta.fechaFinVigencia +` </td></tr>`);
    swal.fire({             
      html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> Datos de la contabilidad </div><br/> <br/>${registro}`,
      showCancelButton: false,
      width: '60%'
    }).then(result=>{
      if (result.isConfirmed) {}
    });
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

}
