import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  public filterSolicitude: Array<any> = [];

    constructor(protected http: HttpClient) { }

    getFilter(solicitudes: any, selectionCriteria: FormGroup) {
        const position = 16;
        const operation = selectionCriteria.value[position].SOLICTUD;
        const status = selectionCriteria.value[position].ESTATUS;
        const solicitudeType = selectionCriteria.value[position].TIPOSOLICITUD;
        this.filterSolicitude = [];
        const soli = [];

        if (solicitudes == undefined || solicitudes == null || solicitudes == '') {
            return solicitudes;
        }
        for (const solicitude of solicitudes) {
            const encontrado = false;
            if (operation == null && status == null && solicitudeType == '' || operation == '' && status == '' && solicitudeType == '') {
                soli.push(solicitude);
                continue;
            }
            if (operation != null && status == null && solicitudeType == '') {
                if (this.retSolicitude(operation) == solicitude.header['request'].name) {
                    soli.push(solicitude);
                }

            }
            if (operation != null && status == null && solicitudeType != '') {
                if (this.retSolicitude(operation) == solicitude.header['request'].name 
                && solicitudeType == solicitude.body['operacion']) {
                    soli.push(solicitude);
                }

            }
            if (operation != null && status != null && solicitudeType == '') {
                if (this.retSolicitude(operation) == solicitude.header['request'].name && this.retStatus(status) == solicitude.header['status'].name) {
                    soli.push(solicitude);
                }

            }
            if (operation != null && status != null && solicitudeType != '') {
                if (this.retSolicitude(operation) == solicitude.header['request'].name
                    && this.retStatus(status) == solicitude.header['status'].name
                    && solicitudeType == solicitude.body['operacion']) {
                    soli.push(solicitude);
                }

            }
            if (operation == null && status != null && solicitudeType == '') {
                if (this.retStatus(status) == solicitude.header['status'].name ) {
                    soli.push(solicitude);
                }

            }
            if (operation == null && status == null && solicitudeType != '') {
                if (solicitudeType == solicitude.body['operacion']) {
                    soli.push(solicitude);
                }

            }            
        }

        for (const solis of soli) {
            this.filterSolicitude.push(solis);            
        }
        
        return this.filterSolicitude;
    }

    // 0: { ky: '1', value: 'SPEI GENERAL' }
    // 1: { ky: '27', value: 'SPEI EGLOBAL' }
    // 2: { ky: '28', value: 'SPEI PROSA' }
    // 3: { ky: '2', value: 'MISMO BANCO' }
    // 4: { ky: '26', value: 'ACH' }
    // 5: { ky: '4', value: 'IPAB' }
    // 6: { ky: '3', value: 'CATS' }
    retSolicitude(value: any) {
        let x = '';
        switch (value) {
            case '0':
                x = 'TODOS';
                break;
            case '1':
                x = 'SPEI GENERAL';
                break;
            case '2':
                x = 'MISMO BANCO';
                break;
            case '3':
                x = 'IPAB';
                break;
            case '4':
                x = 'CATS';
                break;
            case '5':
                x = 'SPEI PROSA';
                break;
            case '6':
                x = 'SPEI EGLOBAL';
                break;
            case '7':
                x = 'SPEI PAGO DE CAJA';
                break;
            case '8':
                x = 'SIC';
                break;
            case '9':
                x = 'SPID';
                break;    
            case '10':
                x = 'CONSULTA DE SALDO';
                break;
            case '10':
                x = 'ACH';
                break;                
            default:
                x = 'TODOS';
                break;
        }
        return x;
    }
    
    retStatus(value: any) {
        let x = '';
        switch (value) {
            case '1':
                x = 'PRESOLICITUD';
                break;
            case '2':
                x = 'CAPTURADA';
                break;
            case '3':
                x = 'PREVALIDADO';
                break;
            case '4':
                x = 'VALIDADO';
                break;
            case '5':
                x = 'PROCESADA';
                break;
            case '6':
                x = 'RECHAZADA';
                break;
            case '7':
                x = 'CANCELADA';
                break;
            case '8':
                x = 'SIN PROCESAR';
                break;
            case '9':
                x = 'INCOMPLETO';
                break;
            default:
                x = 'TODOS';
                break;
        }
        return x;
    }
}
