import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Operaciones } from '@app/core/models/operaciones/operaciones.model';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';
import { OperationsTableComponent } from './operations-table/operations-table.component';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.sass']
})

export class OperationsComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Operaciones[];

  @ViewChild(OperationsTableComponent) catalogsTable:OperationsTableComponent;


  constructor(private readonly appComponent: AppComponent, private injector:Injector) { 
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new OperationsTableComponent();
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

    this.dataInfo=[{idTipoOperacion:"1",descripcionTipoOperacion:'Compra de película',idCanal:'13',topicoKafka:'COMPRA-DE-PELICULAS',status:'A'} as Operaciones,
    {idTipoOperacion:"2",descripcionTipoOperacion:'Compra de película',idCanal:'13',topicoKafka:'COMPRA-DE-PELICULAS',status:'A'} as Operaciones

    ];

  }

  onSubmit()
  {
    let obj:Operaciones = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['OPERACIONES'] as Operaciones;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }    
  }
}
