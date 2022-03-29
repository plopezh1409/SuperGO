import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceNoMagicNumber } from '@app/core/models/ServiceResponseCodes/service-response-codes.model';
import { environment } from 'src/environments/environment';
const forge = require('node-forge');

@Injectable({
    providedIn: 'root',
  })
export class AngularSecurityRSAService{

    private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber();
    publicKey:string;
    privateKey:string;

    constructor(private http: HttpClient){
        this.publicKey = environment.urlPublicKeyRSA;
        this.privateKey = environment.urlPrivateKeyRSA;
    }

    arrayBuffertoB64(byteArray:any):string
    {        
        let byteString = '';
        for(let i=0; i < byteArray.length; i++) {
        byteString += String.fromCharCode(byteArray[i]);
        }
        const b64 = btoa(byteString);        
        return b64;
    }  

    b64toArrayBuffer(str:string):any
    {
        const dec = atob(str); 
        let bytes:any[] = []; 
        for(let i = 0; i < dec.length; i++) {
        const code = dec.charCodeAt(i);   
        bytes = bytes.concat([code]);      
        }
        const unitArray = new Uint8Array(bytes);        
        return Buffer.from(unitArray).toString('hex').toUpperCase();
    }

    addNewLines(str:string):string
    {    
        let finalString = '';
        while(str.length > 0) {
        finalString += str.substring(0, Number(this.codeResponseMagic.RESPONSE_CODE_64)) + '\n';
        str = str.substring(Number(this.codeResponseMagic.RESPONSE_CODE_64));
        }
    
        return finalString;
    }

    encryptRSA(data : any){
        const pki = forge.pki;
        const buffer = Buffer.from(this.publicKey, 'hex');
        const publicK = this.addNewLines(this.arrayBuffertoB64(buffer));
        const rsa = pki.publicKeyFromPem(`-----BEGIN PUBLIC KEY-----${publicK}-----END PUBLIC KEY-----`);
        return btoa(rsa.encrypt(data));
    }

    decryptRSA(data : any)
    {   let decryptRSA=null;     
        try{
            if(data!=null)
            {
                const pki = forge.pki;
                const buffer = Buffer.from(this.privateKey, 'hex');
                const privateK= this.addNewLines(this.arrayBuffertoB64(buffer));
                const rsa = pki.privateKeyFromPem(`-----BEGIN PRIVATE KEY-----${privateK}-----END PRIVATE KEY-----`);
                decryptRSA = rsa.decrypt(atob(data));
            }
            
            return decryptRSA;
        }
        catch(ex)
        {
            console.log('decryptRSA data en null');
        }
        
    }
}