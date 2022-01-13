import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormMonetizationsService } from '@app/core/services/monetizations/formMonetizations.service';


@Component({
  selector: 'app-update-modal-monetization',
  templateUrl: './update-modal-monetization.component.html',
  styleUrls: ['./update-modal-monetization.component.sass']
})

export class UpdateModalMonetizationComponent implements OnInit {

  formCatService:FormMonetizationsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';

  
  constructor(private injector:Injector,public refData?:MatDialog) { 
    this.formCatService = this.injector.get<FormMonetizationsService>(FormMonetizationsService);
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
