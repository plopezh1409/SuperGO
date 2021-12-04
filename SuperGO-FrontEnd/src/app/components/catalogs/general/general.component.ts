import { Component, Injector, OnInit } from '@angular/core';
import { Container } from '@app/core/models/capture/container.model';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormCatService } from '@app/core/services/catalogs/formCat.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.sass']
})
export class GeneralComponent implements OnInit {
  formCatService:FormCatService;
  reactiveForm:ReactiveForm;
  containers:Container[];


  constructor(private injector:Injector) { 
    this.formCatService = this.injector.get<FormCatService>(FormCatService);
    this.reactiveForm= new ReactiveForm();
    this.containers=[];
  }

  ngOnInit(): void {
    this.formCatService.getForm().subscribe((data:any)=>{
      this.containers = data.response;
      this.reactiveForm.setContainers(this.containers);
    });
  }

  onSubmit()

}
