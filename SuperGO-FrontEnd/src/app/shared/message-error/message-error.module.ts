import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import swal from 'sweetalert2';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MessageErrorModule {
  showMessageError(message:string, code:number){
    switch (code) {
      case 400: //Solicitud incorrecta
        swal.fire({
          icon: 'warning',
          title: 'Solicitud incorrecta',
          text: message,
          heightAuto: false
        });
        break;
        case 401://No autorizado
        swal.fire({
          icon: 'error',
          title: 'No autorizado',
          text: message,
          heightAuto: false
        });
        break;
      case 404://Peticion no esta en servidor
        swal.fire({
          icon: 'warning',
          title: 'Petición no encontrada',
          text: message,
          heightAuto: false
        });
        break;
      case 500://Error Inesperado
        swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: message,
          heightAuto: false
        });
        break;
      default:
        break;
    }
  }

 }
