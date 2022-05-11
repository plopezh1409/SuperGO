import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../sesion/auth.service';

@Injectable()
export class BinnacleService {
  
  private readonly urlEndPoint: any;
  private readonly httpClient: HttpClient;

  colors = [
      { statusId: '0', border: '4px solid #dc3545', color: '#dc3545' }, // GRIS - NO STATUS
      { statusId: '1', border: '4px solid #676364', color: '#676364' }, // GRIS - PRESOLICITUD
      { statusId: '2', border: '4px solid #676364', color: '#676364' }, // GRIS - CAPTURADA
      { statusId: '3', border: '4px solid #EBD359', color: '#EBD359' }, // AMARILLO - PREVALIDADO
      { statusId: '4', border: '4px solid #006360', color: '#006360' }, // VERDE - VALIDADO
      { statusId: '5', border: '4px solid #006360', color: '#006360' }, // VERDE - PROCESADA
      { statusId: '6', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  RECHAZADA
      { statusId: '7', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  CANCELADA
      { statusId: '8', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  SIN PROCESAR
      { statusId: '9', border: '4px solid #006360', color: '#006360' }, // VERDE -  INCOMPLETO
    ];

  colorsMatrix = [
      { statusId: '0', border: '10px solid #dc3545',color:'#dc3545' },    // ROJO -  RECHAZADA
      { statusId: '1', border: '10px solid #006360',color:'#006360' },     // VERDE
      { statusId: '2', border: '10px solid #D0D0D0',color:'#D0D0D0' }     // gris - PRE-AUTORIZADO
  ];
  
  constructor(private readonly http: HttpClient, authservice:AuthService) {
    this.httpClient = http;
    this.urlEndPoint = authservice.urlEnviroment;
  }

  getcards(){
    return this.httpClient.post<any>(`${this.urlEndPoint}binnacle`, {});
  }
  
  getResponse(invoice: string | null): Observable<any> {
    const codeError = 400;
    const json = {
      invoice
    };
    return this.http.post<any>(`${this.urlEndPoint}request/datail`, json).pipe(
      catchError(e => {
        if (e.status == codeError) {
          return throwError(e);
        }
        return throwError(e);
      }));
    }

    getColorBorder(estatus: string) {
        if(estatus){
            return this.colors.filter(item => item.statusId === estatus)[0].border;
        }
        return 0;
    }

    getBorderMatrix(estatus: string) {
        if(estatus){
            return this.colorsMatrix.filter(item => item.statusId === estatus)[0].border;
        }
        return 0;
    }

    getColor(estatus: string) {
        if(estatus){
            return this.colors.filter(item => item.statusId === estatus)[0].color;
        }
        return 0;
    }

}
