import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormOperationsService } from '@app/core/services/operations/formOperations.service';

@Component({
  selector: 'app-update-modal-operation',
  templateUrl: './update-modal-operation.component.html',
  styleUrls: ['./update-modal-operation.component.sass']
})
export class UpdateModalOperationComponent implements OnInit {

  formCatService:FormOperationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';

  
  constructor(private injector:Injector,public refData?:MatDialog) { 
    this.formCatService = this.injector.get<FormOperationsService>(FormOperationsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
  }

  ngOnInit(): void {

    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;      
      this.reactiveForm.setContainers(this.containers);
    });

  }


  close(){
    this.refData?.closeAll()
   }

}
