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

  async ngOnInit() {
    console.log("GeneralComponent ngOnInit");
    this.formCatService.getData().subscribe(async (data:any)=>{
      this.dataInfo = data.resultado.sociedadesExistentes;
      this.catalogsTable.onLoadTable(this.dataInfo);
     });

    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });
  }

  onSubmit(value:any)
  {
    var newCatalog;
    for(var datas of Object.values(value)){
      newCatalog = datas;
    }
    var strCatalog = JSON.stringify(newCatalog);
    // this.formCatService.sendData(JSON.parse(strCatalog)).subscribe((data:any)=>{ });

    // let obj:Sociedad = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['SOCIEDADES'] as Sociedad;    
    // this.dataInfo.push(obj);
    // if(this.catalogsTable) { this.catalogsTable.onLoadTable(this.dataInfo); }

  }
  



}
