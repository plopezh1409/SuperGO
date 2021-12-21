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


  constructor(private injector:Injector,public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any, private readonly _route?: ActivatedRoute) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
    this.formService = this.injector.get<FormService>(FormService);
    console.log(dataModal.dataModal)
  }
  

  ngOnInit(): void {
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;
      this.getdata();
      this.reactiveForm.setContainers(this.containers);
    });
  }

  getdata() {
    let jsonPetition: string = `{ "info":{`;
    this.containers.forEach((cont: Container) => {
      const _formAux = this.reactiveForm.principalForm?.get(

        cont.idContainer

      ) as FormGroup;

      jsonPetition = `${jsonPetition} "${cont.idContainer}":{`;

      cont.controls.forEach((x: Control) => {

        const ctrl: Control = Object.assign(new Control(), x);

        switch (ctrl.controlType) {

          case 'datepicker':

            jsonPetition = `${jsonPetition} "${

              ctrl.ky

            }" : "${ctrl.getDatePickerValue(_formAux)}",`;

            break;

          case 'decimal':

            jsonPetition = `${jsonPetition} "${

              ctrl.ky

            }" : "${ctrl.getDecimalValue(_formAux)}",`;

            break;

          case 'label':

            break;

          case 'checkbox':

            jsonPetition = `${jsonPetition} "${

              ctrl.ky

            }" : "${ctrl.getCheckBoxValue(_formAux)}",`;

            break;

          case 'dropdown':

            jsonPetition = `${jsonPetition} "${

              ctrl.ky

            }" : "${ctrl.getDropDownValue(_formAux)}",`;

            break;

          case 'textboxInfo':

            jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getInfoValue(

              _formAux

            )}",`;

            break;

          case 'autocomplete':

            jsonPetition = `${jsonPetition} "${

              ctrl.ky

            }" : "${ctrl.getAutocompleteValue(_formAux)}",`;

            break;

          default:

            jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getInfoValue(

              _formAux

            )}",`;

            break;

        }

      });

      jsonPetition = jsonPetition.substring(0, jsonPetition.length - 1);

      jsonPetition = `${jsonPetition} },`;

    });

    jsonPetition = jsonPetition.substring(0, jsonPetition.length - 1);

    jsonPetition = jsonPetition + '}} ';

    const newJson = JSON.parse(jsonPetition);
  }



  close(){
   this.refData?.closeAll()
  }

}
