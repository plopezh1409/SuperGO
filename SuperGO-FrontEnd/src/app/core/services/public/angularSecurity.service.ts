import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';
import { AngularSecurityRSAService } from '@app/core/services/public/angularSecurityRSA.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class AngularSecurity {
  private keyAES: string = environment.urlCryptoGS_AES;
  private urlEndPoint = environment.urlCryptoGS_AES;
  private iterations = 65536;
  private keylen = 32;
  constructor(protected http: HttpClient, private angularSecurityRSA: AngularSecurityRSAService) {}  

  public get getKeyAES(): Observable<any> {
    let secretKey: any = this.keyAES;
    return secretKey;
  }

  public get getStorageToken(): string {    
    return 'HgcASn5nS0PF+l32TTbJug==';
  }

  public get getStorageUser(): string {    
    return 'pUP7Cc7eXkSFWDjB/dY6dw==';

  }

  public get getStoragerSelectedRole(): string {    
    return '/qPRpLqLzx9PA/EOLus8mg==';
  }

  public get getStorageSelectedModule()
  {    
    return 'ZUsQ/+b/pkipFzjR6sUm3UEULEx+SuRzSl9KLXO1MNA=';
  }
  
  encryptAES(plainText: string, secretKey: any): any {
    try {
      const algorithm = 'aes-256-cbc';
      const salt = secretKey;
      const digest = 'sha256';

      let iv = Buffer.from(salt.substr(0, 16))

      const key = crypto.pbkdf2Sync(secretKey, salt, this.iterations, this.keylen, digest);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(plainText.toString(), 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      return '';
    }
  }

  decryptAES(strToDecrypt: any, secretKey: any): any {
    try {
      if (strToDecrypt != null && strToDecrypt != '') {
        const algorithm = 'aes-256-cbc';
        const salt = secretKey;
        const digest = 'sha256';

        let iv = Buffer.from(salt.substr(0, 16))

        const key = crypto.pbkdf2Sync(secretKey, salt, this.iterations, this.keylen, digest);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted: any = decipher.update(strToDecrypt, 'base64');
        decrypted += decipher.final().toString();
        return decrypted;
      }      
    } catch (error) {     
    }
    return '';

  }

  //AES + RANDOM SECURITY
  encryptAES2(plainText: string): any {

    try {
      let randomSecurity = this.randomSecurity()
      const algorithm = 'aes-256-ecb';
      const digest = 'sha256';
      const salt = randomSecurity;
      const key = crypto.pbkdf2Sync(randomSecurity, salt, this.iterations, this.keylen, digest);

      let keyToB64 = this.angularSecurityRSA.arrayBuffertoB64(key);
      let keyToHEX = this.angularSecurityRSA.b64toArrayBuffer(keyToB64);
      const cipher = crypto.createCipheriv(algorithm, key, '');
      let encrypted = cipher.update(plainText, 'utf8', 'base64');

      encrypted += cipher.final('base64');

      return { texto: encrypted, llave: keyToHEX };

    } catch (error) {
      return '';
    }
  }

  decryptAES2(strToDecrypt: any, secretKey: any): any {
    try {
      if (strToDecrypt != null || strToDecrypt != '') {
        let bufferKey = Buffer.from(secretKey, 'hex');
        const algorithm = 'aes-256-ecb';
        const decipher = crypto.createDecipheriv(algorithm, bufferKey, '');
        let decrypted: any = decipher.update(strToDecrypt, 'base64');

        decrypted += decipher.final().toString();
        return decrypted;
      }
    } catch (error) {
      return '';
    }
  }

  //CyberARK
  getKey_AES(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}`).pipe(

      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));

  }

  randomSecurity() {
    return cryptoRandomString({ length: 16, type: 'ascii-printable' });
  }
}
