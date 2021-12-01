import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import user from 'src/assets/json/user.json';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private urlEndPoint = environment;
    response = user;


    constructor(protected http: HttpClient) {

    }

    getResponse(): any {
        return this.response;
    }
}
