import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../sesion/auth.service';
import { AngularSecurityRSAService } from '../public/angularSecurityRSA.service';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  public response: string;
  private readonly urlEndPoint: string | null;

  constructor(
      protected http: HttpClient, 
      private readonly angularSecurityRSAService: AngularSecurityRSAService,
      private readonly authService: AuthService) {
      this.response = '';
      this.urlEndPoint = this.authService.urlEnviroment;
  }


  getEvidence(invoice: any): Observable<any> {
      const codeError = 400;

      const json: any = {
          invoice
      };
      const content: any = this.angularSecurityRSAService.encryptRSA(JSON.stringify(json));
      const httpHeader = new HttpHeaders({
          'Content': content
      });
      return this.http.post<any>(`${this.urlEndPoint}evidence`, '', { headers: httpHeader }).pipe(
          catchError(e => {
              if (e.status == codeError) {
                  return throwError(e);
              }
              
              return throwError(e);
          }));
  }

  base64ToArrayBuffer(base64: string) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
  }

  getResponse() {        
      this.http.get('assets/txt/evidence.txt', { responseType: 'text' })
          .subscribe(data => {
              this.response = data;
          });
      return this.base64ToArrayBuffer(this.response);
  }
  
}
