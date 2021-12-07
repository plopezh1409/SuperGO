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

    this.dataInfo=[{sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:'REGLA1',contabilidadDiaria:'D',numeroDeApunte:"1234567",sociedadGl:"1234567",tipoCuenta:"Interna",cuentaSap:"123456MOV",claseDeDocumento:"123456MOV",concepto:"1234567",centroDestino:"1234567",iva:"S",cargoAbono:"C"} as Contabilidad,
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
