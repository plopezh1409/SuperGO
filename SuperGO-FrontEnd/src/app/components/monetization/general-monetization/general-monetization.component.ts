import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
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


  constructor(private readonly appComponent: AppComponent, private injector:Injector) { 
    this.formCatService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new TableMonetizationComponent();
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
  }

  ngOnInit(): void {
    console.log("GeneralComponent ngOnInit");
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });

    this.dataInfo=[{idSociedad:'ELEKTRA',idTipo:'PAGO DE SERVICIOS',idSubtipo:'GENERAL',segmento:"67876.98",montoMonetizacion:"10.00",tipoMonto:"F",idTipoImpuesto:"1",codigoDivisa:"MXN",emisionFactura:"S",indicadorOperacion:"C",periodisidadCorte:"12/02/2021",fechaInicio:"12/02/2021",fechaFin:"13/02/2021" } as Monetizacion,
   
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
