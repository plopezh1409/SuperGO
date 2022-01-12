import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Facturas } from '@app/core/models/facturas/facturas.model';
import { FormBillsService } from '@app/core/services/bills/formBills.service';
import { TableBillsComponent } from '../table-bills/table-bills.component';

@Component({
  selector: 'app-general-bills',
  templateUrl: './general-bills.component.html',
  styleUrls: ['./general-bills.component.sass']
})
export class GeneralBillsComponent implements OnInit {

  formCatService:FormBillsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Facturas[];

  @ViewChild(TableBillsComponent) catalogsTable:TableBillsComponent;


  constructor( private readonly appComponent: AppComponent, private injector:Injector) { 
    this.formCatService = this.injector.get<FormBillsService>(FormBillsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new TableBillsComponent();
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

    this.dataInfo=[{idSociedad:'ELEKTRA',idTipoOperacion:'COLOCACION DE CREDITO - CLIENTES NUEVOS', idSubTipoOperacion:"GENERAL",idReglaMonetizacion:'REGLA1',tipoComprobante:'COMPROBANTE1',tipoFactura:"FACTURA"} as Facturas,
   
    ];

  }

  onSubmit()
  {
    let obj:Facturas = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['FACTURAS'] as Facturas;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }    
  }

}
