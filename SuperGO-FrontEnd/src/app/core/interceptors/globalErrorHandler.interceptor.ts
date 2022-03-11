import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import Swal from 'sweetalert2';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private logger: NGXLogger) {        
    }
    handleError(error: any): void {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;

        if (chunkFailedMessage.test(error.message)) {
            this.logger.error('Error Lazy Load hard Reload forzado ');
            window.location.reload();
          }

        if (!(error instanceof HttpErrorResponse)) {
            this.logger.error('GlobalErrorHandler',error);
            
            if(error!==undefined && typeof error === 'object')
            {
                if(!error.message.includes('HttpErrorResponse'))
                {
                    Swal.fire({
                        html: `<div class="titModal">Aviso</div><br/>
                        <span class="material-icons error-icon">error
                        </span><br/><div>${error.message}</div>`,
                        allowOutsideClick: false,
                        heightAuto: false,
                        confirmButtonText: 'Aceptar'
                    });
                }                
            }            
        } else {
            console.log('GlobalErrorHandler,  error en server apis');
        }
    }
}