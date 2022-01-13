import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-general-monet',
  templateUrl: './general-monet.component.html',
  styleUrls: ['./general-monet.component.sass']
})
export class generalmonetComponent implements OnInit{

  constructor(private readonly appComponent:AppComponent) {
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo =true;
  }
  ngOnInit(): void {
    
  }
}
