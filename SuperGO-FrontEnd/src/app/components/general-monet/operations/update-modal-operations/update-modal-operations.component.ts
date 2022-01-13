import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';

@Component({
  selector: 'app-update-modal-operations',
  templateUrl: './update-modal-operations.component.html',
  styleUrls: ['./update-modal-operations.component.sass']
})

export class UpdateModalOperationsComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;

  
  constructor(private injector:Injector,public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
  }

  ngOnInit(): void {

    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;
      this.reactiveForm.setContainers(this.containers);
      this.dataModal.dataModal.status = this.dataModal.dataModal.status == "A"?"true":"false";
      this.control.setDataToControls(this.containers,this.dataModal);
      this.reactiveForm.setContainers(this.containers);
    });

  }


  close(){
    this.refData?.closeAll()
   }

}
