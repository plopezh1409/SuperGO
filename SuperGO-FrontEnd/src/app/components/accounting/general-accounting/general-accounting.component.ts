import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { TableAccountingComponent } from '../table-accounting/table-accounting.component';

@Component({
  selector: 'app-general-accounting',
  templateUrl: './general-accounting.component.html',
  styleUrls: ['./general-accounting.component.sass']
})
export class GeneralAccountingComponent implements OnInit {

  formCatService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Contabilidad[];

  @ViewChild(TableAccountingComponent) catalogsTable:TableAccountingComponent;


  constructor(private injector:Injector) { 
    this.formCatService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new TableAccountingComponent();
    this.containers=[];
    this.dataInfo=[];
  }

  ngOnInit(): void {
    console.log("GeneralComponent ngOnInit");
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });

    this.dataInfo=[{idSociedad:'BANCO AZTECA',idTipoOperacion:'COLOCACION DE CREDITO - CLIENTES DE BANCO AZTECA Y RECOMPRAS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'4% SOBRE EL MONTO COLOCADO',contabilidadDiaria:'D',numeroApunte:"1",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'BANCO AZTECA',idTipoOperacion:'COLOCACION DE CREDITO - CLIENTES NUEVOS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'9% SOBRE EL MONTO COLOCADO',contabilidadDiaria:'D',numeroApunte:"2",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'BANCO AZTECA',idTipoOperacion:'CREDITO AL CONSUMO Y NEGOCIOS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'5% SOBRE EL CREDITO COLOCADO',contabilidadDiaria:'D',numeroApunte:"3",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'BANCO AZTECA',idTipoOperacion:'TARJETAS DE CREDITO',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'1.25% SOBRE EL LIMTE DE CREDITO',contabilidadDiaria:'D',numeroApunte:"4",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'SAZ',idTipoOperacion:'SEGUROS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'5% SOBRE EL MONTO DE LA POLIZA COLOCADA',contabilidadDiaria:'D',numeroApunte:"1",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'ELEKTRA',idTipoOperacion:'MIS PAGOS - PAGOS DE SERVICIOS, TIEMPO AIRE, TARJETAS DE PREPAGO, ABONO A CREDITOS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'50% DE LA COMICION BACK (NETA DE COSTOS DE TRANSACCION)',contabilidadDiaria:'D',numeroApunte:"2",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'ELEKTRA',idTipoOperacion:'VENTA DE MERCANCIA',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'3.5% SOBRE EL TICKET',contabilidadDiaria:'D',numeroApunte:"3",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'ELEKTRA',idTipoOperacion:'MI NEGOCIO - PAGO DE SERVICIOS, TIMPO AIRE, TARJETAS DE PREPAGO, ABONO A CREDITOS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'20% DE LA COMISION AL FRONT',contabilidadDiaria:'D',numeroApunte:"4",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'ELEKTRA',idTipoOperacion:'MI NEGOCIO - PAGO DE SERVICIOS, TIMPO AIRE, TARJETAS DE PREPAGO, ABONO A CREDITOS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'50% DE LA COMICION BACK (NETA DE COSTOS DE TRANSACCION)',contabilidadDiaria:'D',numeroApunte:"1",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'TOTALPLAY',idTipoOperacion:'PELICULAS ON DEMAND',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'3% DE COMISION SOBRE EL PRECIO DE VENTA',contabilidadDiaria:'D',numeroApunte:"2",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'TOTALPLAY',idTipoOperacion:'WIFI PASS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'10% DE COMISION SOBRE EL PRECIO DE VENTA',contabilidadDiaria:'D',numeroApunte:"3",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'TV AZTECA',idTipoOperacion:'TV EN VIVO Y NOTICIAS',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'60% DE LOS INGRESOS POR VENTA DE PUBLICIDAD VISTA EN SUPERAPP',contabilidadDiaria:'D',numeroApunte:"4",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    {idSociedad:'UPAX',idTipoOperacion:'CHAT Y RED SOCIAL',idSubtipoOperacion:'GENERAL',idReglaMonetizacion:'REGLA1',contabilidadDiaria:'D',numeroApunte:"1",sociedad:"1234567",tipoCuenta:"Interna",cuentaSAP:"123456MOV",claseDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",indicadorIVA:"S",indicadorOperacion:"C",fechaInicioVigencia:"12/12/2021",fechaFinVigencia:"12/12/2022"} as Contabilidad,
    ];

  }

  onSubmit()
  {
    let obj:Contabilidad = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['CONTABILIDAD'] as Contabilidad;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }    
  }
}
