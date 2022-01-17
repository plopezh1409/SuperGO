import { Component } from '@angular/core';

@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.sass']
})
export class ElevatorComponent{  
  regresarInicio(){  
    const interval = 30;
    const position = 20;          
    const scrollToTop = window.setInterval(() => {
    const pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - position); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, interval);  
  }

}
