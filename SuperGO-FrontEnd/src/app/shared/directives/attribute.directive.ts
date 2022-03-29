import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[attributes]'
})
export class AttributeDirective implements OnChanges {

    @Input()
    public attributes: any[];
  
    constructor(
      private renderer: Renderer2,
      private elementRef: ElementRef
    ) {         
      this.attributes=[];
    }
  
    public ngOnChanges(changes: SimpleChanges): void {            
      if (changes.attributes) {
        this.attributes.forEach((elem:any)=>{          
          const [key]= Object.keys(elem);
          if(elem[key])
          {            
            this.renderer.setAttribute(this.elementRef.nativeElement, key, elem[key]);
          }
          else
          {
            this.renderer.removeAttribute(this.elementRef.nativeElement, key);
          }
        });        
      }
    }
  }