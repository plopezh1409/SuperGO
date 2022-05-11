import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularSecurityRSAService } from '../public/angularSecurityRSA.service';
import { AuthService } from '../sesion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public response: string;
  private readonly urlEndPoint: string | null;

  constructor(
      protected http: HttpClient,
      private readonly angularSecurityRSAService: AngularSecurityRSAService,
      private readonly authService: AuthService) {
      this.response = '';
      this.urlEndPoint = this.authService.urlEnviroment;
  }

  getAuthorization(authentication: any, comment: any, folio: any, option: any, type: any): Observable<any> {
      const json: any = {
          'authentication': btoa(authentication),
          comment,
          'folio': [folio],
          option,
          type
      };
      return this.http.post<any>(`${this.urlEndPoint}authorize`, json);
  }

  getAuthorizationAmountValid(authentication: any, comment: any, folio: any, option: any, type: any, amountValid: any): Observable<any> {
      const json: any = {
          'authentication': btoa(authentication),
          comment,
          'folio': [folio],
          option,
          type,
          amountValid
      };
      console.log('json ', json);
      return this.http.post<any>(`${this.urlEndPoint}authorize`, json);
  }

}
