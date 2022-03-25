import { Injectable } from '@angular/core';

//SERVICIOS
import { AngularSecurity } from '@app/core/services/public/angularSecurity.service';

//MODELOS

import { Rol } from '@app/core/models/public/rol.model';
import { User } from '../../models/public/user.model';
import { Page } from '@app/core/models/public/page.module';

/*NOTA:
    ESTA CLASE SOLAMENTE DEBE DE SER USADA EN AUTH SERVICE, YA QUE EL USO INDEBIDO EN OTRAS PUEDE CAUSAR 
    LENTITUD EN EL SISTEMA
*/
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private secretKey: any;
    private keyLocalStorageEncrypt: any;
    private valueLocalStorageEncrypt: any;
    private valueLocalStorageDecrypt: any;
    private userKey: any;
    private tokenKey: any;
    private selectRoleKey: any;
    private selectModuleKey:any;

    constructor(private angularSecurity: AngularSecurity) {
        this.secretKey = this.angularSecurity.getKeyAES;
        this.keyLocalStorageEncrypt = '';
        this.valueLocalStorageEncrypt = '';
        this.valueLocalStorageDecrypt = '';
        this.userKey = this.angularSecurity.getStorageUser;
        this.tokenKey = this.angularSecurity.getStorageToken;
        this.selectRoleKey = this.angularSecurity.getStoragerSelectedRole;
        this.selectModuleKey = this.angularSecurity.getStorageSelectedModule;        
    }

    encryptUserStorage(usuario: User): void {
        this.keyLocalStorageEncrypt = this.angularSecurity.encryptAES('usuario', this.secretKey);
        this.valueLocalStorageEncrypt = this.angularSecurity.encryptAES(JSON.stringify(usuario), this.secretKey);

        localStorage.setItem(this.keyLocalStorageEncrypt, this.valueLocalStorageEncrypt); //SE GUARDA EN LOCALSTORAGE
    }

    encryptTokenStorage(accessToken: string): void {
        this.keyLocalStorageEncrypt = this.angularSecurity.encryptAES('token', this.secretKey);
        this.valueLocalStorageEncrypt = this.angularSecurity.encryptAES(accessToken, this.secretKey);

        localStorage.setItem(this.keyLocalStorageEncrypt, this.valueLocalStorageEncrypt); //SE GUARDA EN LOCALSTORAGE
    }

    encryptSelectedRoleStorage(rol: Rol): void {
        this.keyLocalStorageEncrypt = this.angularSecurity.encryptAES('rolSeleccionado', this.secretKey);
        this.valueLocalStorageEncrypt = this.angularSecurity.encryptAES(JSON.stringify(rol), this.secretKey);

        localStorage.setItem(this.keyLocalStorageEncrypt, this.valueLocalStorageEncrypt); //SE GUARDA EN LOCALSTORAGE
    }

    encryptSelectedModuleStorage(module: Page): void {
        this.keyLocalStorageEncrypt = this.angularSecurity.encryptAES('moduloSeleccionado', this.secretKey);
        this.valueLocalStorageEncrypt = this.angularSecurity.encryptAES(JSON.stringify(module), this.secretKey);

        localStorage.setItem(this.keyLocalStorageEncrypt, this.valueLocalStorageEncrypt); //SE GUARDA EN LOCALSTORAGE
    }

    decryptUserStorage(): JSON | null {
        let usuario: any = localStorage.getItem(this.userKey)!;

        if (usuario !== null && usuario !== '') {
            this.valueLocalStorageDecrypt = JSON.parse(this.angularSecurity.decryptAES(usuario, this.secretKey));
            return this.valueLocalStorageDecrypt;
        } else {
            return null;
        }
    }

    decryptTokenStorage(): string | null {
        let accessToken: any = localStorage.getItem(this.tokenKey)!;

        if (accessToken !== null && accessToken !== '') {
            this.valueLocalStorageDecrypt = this.angularSecurity.decryptAES(accessToken, this.secretKey);
            return this.valueLocalStorageDecrypt;
        } else {
            return null;
        }
    }

    decryptSelectedRoleStorage(): JSON | null {
        let selectedRole: any = localStorage.getItem(this.selectRoleKey)!;

        if (selectedRole !== null && selectedRole !== '') {
            this.valueLocalStorageDecrypt = JSON.parse(this.angularSecurity.decryptAES(selectedRole, this.secretKey));
            return this.valueLocalStorageDecrypt;
        } else {
            return null;
        }
    }

    decryptSelectedModuleStorage(): JSON | null {
        let selectedModule: any = localStorage.getItem(this.selectModuleKey)!;

        if (selectedModule !== null && selectedModule !== '') {
            this.valueLocalStorageDecrypt = JSON.parse(this.angularSecurity.decryptAES(selectedModule, this.secretKey));
            return this.valueLocalStorageDecrypt;
        } else {
            return null;
        }
    }

}