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
  maxNumControls=10;
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

    this.dataInfo=[{razonSocial:'prueba prueba1',RFC:'kehy900909',idTipoSociedad:'EXTERNA'} as Sociedad,
    {razonSocial:'prueba prueba2',RFC:'kehy900908',idTipoSociedad:'EXTERNA'}as Sociedad,
    {razonSocial:'prueba prueba3',RFC:'kehy900907',idTipoSociedad:'EXTERNA'}as Sociedad,
    {razonSocial:'prueba prueba4',RFC:'kehy900906',idTipoSociedad:'EXTERNA'}as Sociedad,
    {razonSocial:'prueba prueba5',RFC:'kehy900905',idTipoSociedad:'EXTERNA'}as Sociedad,
    ];

  }

  onSubmit(value:any)
  { 
    // let datos = {
    //   razonSocial: value[0],
    //   idTipoSociedad: 1//parseInt(value.idTipoSociedad)
    // }

    var sisi:any;
    for(var datas of Object.values(value)){
      sisi = datas;
      console.log(sisi);
    }

    let obsa = JSON.stringify(sisi);
    var newa = JSON.parse(obsa);
    /*var nea=0;
    let obj:Sociedad = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['SOCIEDADES'] as Sociedad;
    
    this.dataInfo.push(obj);
    
    if(this.catalogsTable)
    {
      this.catalogsTable.onLoadTable(this.dataInfo);     
    }*/

  }
  



}
