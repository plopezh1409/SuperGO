import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import swal from 'sweetalert2';
import { ServiceResponseCodes } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MessageErrorModule {
  codeResponse: ServiceResponseCodes = new ServiceResponseCodes();
  showMessageError(message:string, code:number){
    switch (code) {
      case this.codeResponse.RESPONSE_CODE_400: //Solicitud incorrecta
        swal.fire({
          icon: 'warning',
          title: 'Solicitud incorrecta',
          text: message,
          heightAuto: false
        });
        break;
        case this.codeResponse.RESPONSE_CODE_401://No autorizado
        swal.fire({
          icon: 'error',
          title: 'No autorizado',
          text: message,
          heightAuto: false
        });
        break;
      case this.codeResponse.RESPONSE_CODE_404://Peticion no esta en servidor
        swal.fire({
          icon: 'warning',
          title: 'Petición no encontrada',
          text: message,
          heightAuto: false
        });
        break;
      case this.codeResponse.RESPONSE_CODE_500://Error Inesperado
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

  showMessageErrorLoadData(){
    swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: 'Ocurrió un error al cargar los datos, intente mas tarde.',
      heightAuto: false
    }); 
  }

  showMessageErrorRequest(){
    swal.fire({
      icon: 'error',
      title: 'Lo sentimos',
      text: 'Por el momento no podemos proporcionar tu Solicitud.',
      heightAuto: false
    });
  }

  showMessageErrorForm(){
    swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Complete los campos faltantes',
      heightAuto: false
    });
  }

 }
