import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly dataSource = new ReplaySubject<any>(1);
    private header: any;
    private footing: any;
    private json = new ReplaySubject<any>(1);

    constructor() { }

    public get receiveDataSource() {
        return this.dataSource.asObservable();
    }

    public sendDataSource(data: any): void {
        this.dataSource.next(data);
    }

    public get receiveHeader() {
        return this.header;
    }

    public sendHeader(data: any) {
        this.header = data;
    }

    public get receiveFooting() {
        return this.footing;
    }

    public sendFooting(data: any) {
        this.footing = data;
    }

    public get receiveData(){
        return this.json;
    }

    public sendData(json:any){
        this.json = json;
    }
}
