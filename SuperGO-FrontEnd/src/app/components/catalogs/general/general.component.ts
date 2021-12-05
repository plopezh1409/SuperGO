import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { TablaCatalogoComponent } from '../tabla-catalogo/tabla-catalogo.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.sass']
})
export class GeneralComponent implements OnInit {
  formCatService:FormCatService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=4;
  alignContent='horizontal';
  public dataInfo:Sociedad[];

  @ViewChild(TablaCatalogoComponent) catalogsTable:TablaCatalogoComponent;


  constructor(private injector:Injector) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new TablaCatalogoComponent();
    this.containers=[];
    this.dataInfo=[];
  }

  ngOnInit(): void {
    console.log("GeneralComponent ngOnInit");
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });

    this.dataInfo=[{razonSocial:'prueba prueba',rfc:'kehy900909',tipoDeSociedad:'2-EXTERNA'} as Sociedad,
    {razonSocial:'prueba prueba',rfc:'kehy900909',tipoDeSociedad:'2-EXTERNA'}as Sociedad,
    {razonSocial:'prueba prueba',rfc:'kehy900909',tipoDeSociedad:'2-EXTERNA'}as Sociedad,
    {razonSocial:'prueba prueba',rfc:'kehy900909',tipoDeSociedad:'2-EXTERNA'}as Sociedad,
    {razonSocial:'prueba prueba',rfc:'kehy900909',tipoDeSociedad:'2-EXTERNA'}as Sociedad,
    ];

  }

  onSubmit()
  {
    let obj:Sociedad = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['SOCIEDADES'] as Sociedad;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }    
  }

}
