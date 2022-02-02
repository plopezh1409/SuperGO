import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Contabilidad } from '@app/core/models/contabilidad/contabilidad.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';
import { AccountingTablesComponent } from './accounting-tables/accounting-tables.component';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.sass']
})

export class AccountingComponent implements OnInit {

  formCatService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  maxNumControls=10;
  alignContent='horizontal';
  public dataInfo:Contabilidad[];

  @ViewChild(AccountingTablesComponent) catalogsTable:AccountingTablesComponent;


  constructor( private readonly appComponent: AppComponent, private injector:Injector) { 
    this.formCatService = this.injector.get<FormAccountingsService>(FormAccountingsService);
    this.reactiveForm = new ReactiveForm();
    this.catalogsTable = new AccountingTablesComponent();
    this.containers=[];
    this.dataInfo=[];
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
  }

  ngOnInit(): void {
    this.fillDataPage();
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

  async fillDataPage(){
    this.appComponent.showLoader(true);
    let dataForm = await this.formCatService.getForm().toPromise().catch((err) =>{
      return err;
    });
    var dataAcco = await this.formCatService.getInfoAccounting().toPromise().catch((err) =>{
      return err;
    });
    this.appComponent.showLoader(false);
    if(dataForm.code !== 200){
      this.showMessageError(dataForm.message, dataForm.code);
    }
    else if(dataAcco.code !== 200) {
      this.showMessageError(dataAcco.message, dataAcco.code);
    }
    else{
      this.containers = dataForm.response.reactiveForm;//this.addDataDropdown(dataForm.response.reactiveForm,dataAcco.response.canal);
      this.dataInfo = dataAcco.response.registrosContables;
      this.reactiveForm.setContainers(this.containers);
      localStorage.setItem("_auxForm",JSON.stringify(this.containers));
      this.catalogsTable.onLoadTable(this.dataInfo);
    }
  }

  showMessageError(menssage:string, code:number){
        switch (code) {
          case 400: //Solicitud incorrecta
            swal.fire({
              icon: 'warning',
              title: 'Solicitud incorrecta',
              text: menssage,
              heightAuto: false
            });
            break;
          case 404://No autorizado
            swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: menssage,
              heightAuto: false
            });
            break;
          case 500://Error Inesperado
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: menssage,
              heightAuto: false
            });
            break;
          default:
            swal.fire({
              icon: 'error',
              title: 'Error inesperado',
              text: "Intente de nuevo",
              heightAuto: false
            });
            break;
        }
      }

      updateTable(){
        this.appComponent.showLoader(true);
        this.formCatService.getInfoAccounting().pipe(finalize(() => { this.appComponent.showLoader(false); })).
        subscribe((data:any)=>{
          switch (data.code) {
            case 200:
              this.dataInfo = data.response;
              this.catalogsTable.onLoadTable(this.dataInfo);
            break;
        case 400: //Solicitud incorrecta
        case 401:
        case 500:
        default:
          swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: "Ocurrió un error al cargar los datos, intente mas tarde.",
            heightAuto: false
          });
        break;
        }
    },(err:any) => {
      swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: "Ocurrió un error al cargar los datos, intente mas tarde.",
        heightAuto: false
      });      
    });
  }

}
