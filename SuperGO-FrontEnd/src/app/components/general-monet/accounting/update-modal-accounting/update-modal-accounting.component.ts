import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormAccountingsService } from '@app/core/services/accountings/formAccountings.service';


@Component({
  selector: 'app-update-modal-accounting',
  templateUrl: './update-modal-accounting.component.html',
  styleUrls: ['./update-modal-accounting.component.sass']
})

export class UpdateModalAccountingComponent implements OnInit {

  formCatService:FormAccountingsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';

  
  constructor(private injector:Injector,public refData?:MatDialog) { 
    this.formCatService = this.injector.get<FormAccountingsService>(FormAccountingsService);
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
    return(
      this.refData?.closeAll());
   }

}
