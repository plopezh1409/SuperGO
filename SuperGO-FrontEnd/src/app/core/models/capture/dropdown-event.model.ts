import { Control } from "./controls.model";

export class DropdownEvent {
   control: Control;
   idContainer: string;

   constructor(){
      this.control = new Control();
      this.idContainer = '';
   }
}
