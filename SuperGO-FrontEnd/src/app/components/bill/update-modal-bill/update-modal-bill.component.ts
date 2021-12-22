import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from '@app/core/models/capture/container.model';
import { Control } from '@app/core/models/capture/controls.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormBillsService } from '@app/core/services/bills/formBills.service';

@Component({
  selector: 'app-update-modal-bill',
  templateUrl: './update-modal-bill.component.html',
  styleUrls: ['./update-modal-bill.component.sass']
})
export class UpdateModalBillComponent implements OnInit {

  formCatService:FormBillsService;
  reactiveForm:ReactiveForm;
  containers:Container[];
  alignContent='horizontal';
  public control:Control = new Control;

  
  constructor(private injector:Injector,public refData?:MatDialog, @Inject(MAT_DIALOG_DATA)public dataModal?:any) { 
    this.formCatService = this.injector.get<FormBillsService>(FormBillsService);
    this.reactiveForm = new ReactiveForm();
    this.containers=[];
  }

  ngOnInit(): void {
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;
      this.reactiveForm.setContainers(this.containers);
      this.control.setDataToControls(this.containers,this.dataModal);
      this.reactiveForm.setContainers(this.containers);
    });

  }


  close(){
    this.refData?.closeAll()
   }

}
