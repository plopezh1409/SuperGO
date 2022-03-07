import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import swal from 'sweetalert2';
import { UpdateModalAccountingComponent } from '../update-modal-accounting/update-modal-accounting.component';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { finalize } from 'rxjs/operators';
import { MessageErrorModule } from '@app/shared/message-error/message-error.module';

 
@Component({
  selector: 'app-accounting-tables',
  templateUrl: './accounting-tables.component.html',
  styleUrls: ['./accounting-tables.component.sass']
})

export class AccountingTablesComponent implements OnInit {

  @Input()dataInfo:Contabilidad[];
  accountService:FormAccountingsService;
  messageError: MessageErrorModule;
  dataSource:MatTableDataSource<Contabilidad>;
  displayedColumns: string[] = ['razonSocial', 'descripcionTipoOperacion', 'descSubTipoOperacion', 'idReglaMonetizacion','fechaInicioVigencia','fechaFinVigencia','options', 'options2'];
  totalRows:number = 0;
  pageEvent: PageEvent;
  containers:any;
  private showLoad: boolean = false;
  private loaderDuration: number;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  
  constructor(private injector:Injector,public refData?:MatDialog) {    
    this.accountService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.messageError = new MessageErrorModule();
    this.dataInfo=[];    
    this.dataSource = new MatTableDataSource<Contabilidad>();
    this.pageEvent= new PageEvent();   
    this.loaderDuration = 100;
   }

  ngOnInit(): void {
    if(this.dataInfo.length !== 0)
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

  async open(element:Contabilidad){
    this.showLoader(true);
    let data = await this.accountService.getAccountingById(element).toPromise().catch((err) => {
      return err;
    });
    this.showLoader(false);
    if (data.code !== 200) {
      this.messageError.showMessageError(data.message, data.code);
      return;
    }
    else{
      let oConta:Contabilidad = data.response.registroContable;
      oConta.contabilidadDiaria = oConta.contabilidadDiaria == "D"?"true":"false";
      oConta.indicadorIVA = oConta.indicadorIVA == "AA"?"true":"false";
      var _auxForm = this.disabledFields(this.containers);
      return( this.refData?.open(UpdateModalAccountingComponent,{
        width: '70%',
        data:{
          dataModal:oConta,
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
  }

  async show(element:Contabilidad){
    this.showLoader(true);
    let data = await this.accountService.getAccountingById(element).toPromise().catch((err) => {
      return err;
    });
    this.showLoader(false);
    if (data.code !== 200) {
      this.messageError.showMessageError(data.message, data.code);
      return;
    }
    else{
      let oConta:Contabilidad = data.response.registroContable;
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
      swal.fire({             
        html:`<div class="titModal" style="font-weight: bold; text-align: center; font-size: 30px !important;"> Datos de la contabilidad </div><br/> <br/>${registro}`,
        showCancelButton: false,
        width: '60%'
      }).then(result=>{
        if (result.isConfirmed) {}
      });
  }
  }

  disabledFields(_auxForm:any){
    let element:any; let ctrl:any;
    for(element of _auxForm)
      for(ctrl of element.controls) 
        if(ctrl.ky === 'idSociedad'){
          ctrl.disabled = true;
        }
        else if(ctrl.ky === 'idTipoOperacion'){
          ctrl.disabled = true;
        }
        else if(ctrl.ky === 'idSubTipoOperacion'){
          ctrl.disabled = true;
        }
    return _auxForm;
  }

  showLoader(showLoad: boolean): void {
    setTimeout(() => {
      this.showLoad = showLoad;
    }, this.loaderDuration);
  }

    ngOnDestroy(): void {
    return( this.refData?.closeAll());
  }

}
