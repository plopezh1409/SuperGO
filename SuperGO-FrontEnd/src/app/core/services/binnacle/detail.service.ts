import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private readonly urlEndPoint = environment;
  colors = [
      { statusId: '001', border: '5px solid #676364',color:'#676364' },     // GRIS
      { statusId: '004', border: '5px solid #006341',color:'#006341' },     //VERDE
      { statusId: '005', border: '5px solid #006341',color:'#006341' },     //VERDE
      { statusId: '006', border: '5px solid #dc3545',color:'#dc3545' },     //ROJO
      { statusId: '007', border: '5px solid #dc3545',color:'#dc3545' },     //ROJO
      { statusId: '008', border: '5px solid #dc3545',color:'#dc3545' },     //ROJO
      { statusId: '009', border: '5px solid #dc3545',color:'#dc3545' },     //ROJO
      { statusId: '010', border: '5px solid #dc3545',color:'#dc3545' },     //ROJO
      { statusId: '002', border: '5px solid #EBD359',color:'#EBD359' },     // AMARILLO
      { statusId: '003', border: '5px solid #EBD359',color:'#EBD359' }      // AMARILLO
  ];

    constructor(protected http: HttpClient) { }

    detailList(): Observable<any> {
      const codeError = 400;
      return this.http.post<any>(`${this.urlEndPoint}bitacora`, 'BODY GENIAL').pipe(
        catchError(e => {
          if (e.status == codeError) {
            return throwError(e);
          }
          return throwError(e);
        }));
      }

    getColorBorder(estatus: any) {
        return this.colors.filter(item => item.statusId === estatus)[0].border;
    }
    getColor(estatus: any) {
        return this.colors.filter(item => item.statusId === estatus)[0].color;
    }
}
