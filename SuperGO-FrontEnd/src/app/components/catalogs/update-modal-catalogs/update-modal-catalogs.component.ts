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

  public control:Control = new Control;

  constructor(private injector:Injector,public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];

  
    
  }
  

  ngOnInit(): void {
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;
      this.reactiveForm.setContainers(this.containers);


      var obj_dataModal = this.dataModal;
      obj_dataModal = Object.values(obj_dataModal).map((data:any) =>{
        return obj_dataModal[data] = Object.values(data).slice(1);
      });
      this.control.setDataToControls(this.containers,obj_dataModal);
      this.reactiveForm.setContainers(this.containers);
    });
  }

  modify(){
    
  }





  close(){
   this.refData?.closeAll()
  }

}
