import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';
import { element } from 'protractor';
import { FormGroup } from '@angular/forms';
import { Control } from '@app/core/models/capture/controls.model';
import { FormService } from '@app/core/services/capture/form.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-modal-catalogs',
  templateUrl: './update-modal-catalogs.component.html',
  styleUrls: ['./update-modal-catalogs.component.sass']
})

export class UpdateModalCatalogsComponent implements OnInit {
  formCatService:FormCatService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public idModule: string | null | undefined;
  private readonly formService: FormService | undefined;


  constructor(private injector:Injector,public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    
    this.containers=[];
    this.formService = this.injector.get<FormService>(FormService);
  
    
  }
  

  ngOnInit(): void {
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;
      this.reactiveForm.setContainers(this.containers);
      this.getdata();
      this.reactiveForm.setContainers(this.containers);
    });
  }

  


  getdata() {
    this.containers.forEach((cont: Container) => {

      const _formAux = this.reactiveForm.principalForm?.get(

        cont.idContainer

      ) as FormGroup;

   
      cont.controls.forEach((x: Control, i) => {

        const ctrl: Control = Object.assign(new Control(), x);
        var key = this.dataModal.keys[i];
        
        switch (ctrl.controlType) {

          case 'datepicker':

            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);

            break;

          case 'decimal':

            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);
            break;

          case 'label':
            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);
            break;

          case 'checkbox':

            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);

            break;

          case 'dropdown':

            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);

            break;

          case 'textboxInfo':
            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);
            break;

          case 'autocomplete':

            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);
            break;

          default:
            ctrl.setAttributeValueByName("value",this.dataModal.dataModal[key]);
            break;
        }
        
      });



    });

  
  }



  close(){
   this.refData?.closeAll()
  }

}
