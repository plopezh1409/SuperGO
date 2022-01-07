import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Sociedad } from '@app/core/models/catalogos/sociedad.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { TablaCatalogoComponent } from '../tabla-catalogo/tabla-catalogo.component';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

//COMPONENTS
import { AppComponent } from '@app/app.component';

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
  public showLoad: boolean = false;


  @ViewChild(TablaCatalogoComponent) catalogsTable:TablaCatalogoComponent;


  constructor(private injector:Injector, private appComponent: AppComponent) { 
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

     //Consulta api
     //this.appComponent.showLoader(true);
    //  this.formCatService.getData()
    //   .pipe(finalize((this.appComponent.showLoader(false)) => {  }))
    //   .subscribe((response:any) => {
    //     switch (response.code) {
    //       case 200: //Consulta exitosa
    //       this.dataInfo = response.resultado.sociedadesExistentes;
    //       this.catalogsTable.onLoadTable(this.dataInfo);
    //         break;
    //       case 400: //Solicitud incorrecta
    //         swal.fire({
    //           icon: 'warning',
    //           title: 'Solicitud incorrecta',
    //           text: response.mensaje,
    //           heightAuto: false
    //         });
    //         break;
    //       case 401://No autorizado
    //         swal.fire({
    //           icon: 'warning',
    //           title: 'No autorizado',
    //           text: response.mensaje,
    //           heightAuto: false
    //         });
    //         break;
    //       case 500://Error Inesperado
    //         swal.fire({
    //           icon: 'error',
    //           title: 'Error inesperado',
    //           text: response.mensaje,
    //           heightAuto: false
    //         });
    //         break;
    //       default: break;
    //     }
    //   }, (err:any) => {
    //     if (err.status == 500 || err.status == 400) {
    //       swal.fire({
    //         icon: 'error',
    //         title: 'Lo sentimos',
    //         text: 'Por el momento no podemos proporcionar tu Solicitud.',
    //         heightAuto: false
    //       });
    //     }       
    //   });

    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });
  }

  onSubmit(value:any)
  {
    if(!value)
      return;
    var newSociety;
    for(var datas of Object.values(value)){
      newSociety = datas;
    }

    //Borra el formulario
    this.containers = [];
    this.reactiveForm.setContainers(this.containers);

    var strCatalog = JSON.stringify(newSociety);
    /*this.formCatService.updateRecord(newSociety)
      .pipe(finalize(() => {  }))
      .subscribe((response:any) => {
        switch (response.code) {
          case 200: //Se modifico el registro correctamente
            swal.fire({
              icon: 'success',
              title: 'Correcto  ',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          case 400: //Solicitud incorrecta
            swal.fire({
              icon: 'warning',
              title: 'Solicitud incorrecta',
              text: response.mensaje, 
              heightAuto: false
            });
            break;
          case 401://No autorizado
            swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          case 500://Error Inesperado
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: response.mensaje,
              heightAuto: false
            });
            break;
          default: break;
        }
      }, (err:any) => {
        if (err.status == 500 || err.status == 500) {
          swal.fire({
            icon: 'error',
            title: 'Lo sentimos',
            text: 'Por el momento no podemos proporcionar tu Solicitud.',
            heightAuto: false
          });
        }       
      });*/

    // this.formCatService.sendData(JSON.parse(strCatalog)).subscribe((data:any)=>{ });

    // let obj:Sociedad = JSON.parse(this.reactiveForm.getInfoByJsonFormat(this.containers))['SOCIEDADES'] as Sociedad;    
    // this.dataInfo.push(obj);
    // if(this.catalogsTable) { this.catalogsTable.onLoadTable(this.dataInfo); }
  }

}
