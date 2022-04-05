import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularSecurity } from '../public/angularSecurity.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root',
})
export class MasterKeyService {
  private cle: any;
  public responseType: string;
  public clientId: string;
  public clientSecret: string;
  public redirectUri: string;
  public scope: string;
  public acrValues: string;
  public rp: string;
  private urlGsAuth: string;
  private urlGSLogOut: string;
  private urlSuperGo: any;

  public key: any;

  deviceInfo: any = null;

  constructor(
    private http: HttpClient,     
    private angularSecurity: AngularSecurity,
    private deviceService: DeviceDetectorService,    
    private router: Router,
    authService: AuthService,
  ) {
    this.responseType = 'code';
    this.cle = this.angularSecurity.getKeyAES;
    this.clientId = this.angularSecurity.decryptAES(environment.client_id, this.cle);
    this.clientSecret = this.angularSecurity.decryptAES(environment.client_secret, this.cle);
    this.redirectUri = this.angularSecurity.decryptAES(environment.redirect_uri, this.cle);
    this.scope = this.angularSecurity.decryptAES(environment.scope, this.cle);
    this.acrValues = this.angularSecurity.decryptAES(environment.acr_values, this.cle);
    this.rp = this.angularSecurity.decryptAES(environment.rp, this.cle);
    this.urlGsAuth = environment.urlAuthGS;
    this.urlGSLogOut = environment.urlAuthGSLogOut;
    this.urlSuperGo = authService.urlEnviroment;

    this.deviceInfo = this.deviceService.getDeviceInfo();

    this.key = '';
  }

  getAuthz(): Observable<any> {
    return this.http.get(`
    ${this.urlGsAuth}?response_type=${this.responseType}
    &client_id=${this.clientId}
    &client_secret=${this.clientSecret}
    &redirect_uri=${this.redirectUri}
    &scope=${this.scope}
    &acr_values=${this.acrValues}`);
  }

  getUrlAuthz(): string {

    return `${this.urlGsAuth}?response_type=${this.responseType}
    &client_id=${this.clientId
    }&client_secret=${this.clientSecret}
    &redirect_uri=${this.redirectUri}
    &scope=${this.scope}
    &acr_values=${this.acrValues}`;
  }

  //response_type = code
  getUserInfo(token: string): Observable<any> {
    const body: any = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code: btoa(token),
    };

    return this.http.post(`${this.urlSuperGo}login/keyMaster`, body);
  }  

  logout(): string {
    return `${this.urlGSLogOut}?rp=${this.rp}`;
  }
}