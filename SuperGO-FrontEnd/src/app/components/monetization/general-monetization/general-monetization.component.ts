import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Monetizacion } from '@app/core/models/monetizacion/monetizacion.model';
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';
import { TableMonetizationComponent } from '../table-monetization/table-monetization.component';

@Component({
  selector: 'app-general-monetization',
  templateUrl: './general-monetization.component.html',
  styleUrls: ['./general-monetization.component.sass']
})
export class GeneralMonetizationComponent implements OnInit {

  formCatService:FormMonetizationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Monetizacion[];

  @ViewChild(TableMonetizationComponent) catalogsTable:TableMonetizationComponent;


  constructor(private injector:Injector) { 
    this.formCatService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new TableMonetizationComponent();
    this.containers=[];
    this.dataInfo=[];
  }

  ngOnInit(): void {
    console.log("GeneralComponent ngOnInit");
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });

    this.dataInfo=[{sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,
    {sociedad:'ELEKTRA',operacion:'PAGO DE SERVICIOS',subOperacion:'GENERAL',monetizacion:"REGLA1",segmento:"67876.98",montoDeMonetizacion:"10.00",porcentaje:"9%",fijo:"4",unidades:"4",tipoDeImpuesto:'GENERAL',divisa:"MXN",emisionDeFactura:"S",cobroPago:"C",corte:"12/02/2021",fechaDeInicioDeVigencia:"12/02/2021",fechaDeFinDeVigencia:"13/02/2021" } as Monetizacion,

    ];

  }

  onSubmit()
  {
    let obj:Monetizacion = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['MONETIZACION'] as Monetizacion;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }    
  }

}
