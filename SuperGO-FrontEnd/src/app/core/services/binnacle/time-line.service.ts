import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeLineService {
  colors = [
    { statusId: '0', border: '4px solid #dc3545', color: '#dc3545' }, // GRIS - NO STATUS
    { statusId: '1', border: '4px solid #676364', color: '#676364' }, // GRIS - PRESOLICITUD
    { statusId: '2', border: '4px solid #676364', color: '#676364' }, // GRIS - CAPTURADO
    { statusId: '3', border: '4px solid #EBD359', color: '#EBD359' }, // AMARILLO - PRE-AUTORIZADO
    { statusId: '4', border: '4px solid #006360', color: '#006360' }, // VERDE - AUTORIZADO
    { statusId: '5', border: '4px solid #006360', color: '#006360' }, // VERDE - PROCESADO
    { statusId: '6', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  RECHAZADA
    { statusId: '7', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  CANCELADA
    { statusId: '8', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  SIN PROCESAR
    { statusId: '9', border: '4px solid #006360', color: '#006360' }, // VERDE -  VALIDADA
  ];

  colorsStatus = [
    { statusId: '0', border: '4px solid #dc3545', color: '#dc3545' }, // ROJO -  RECHAZADA
    { statusId: '1', border: '4px solid #006360', color: '#006360' }, // VERDE - AUTORIZADO
/*     { statusId: '2', border: '4px solid #676364', color: '#676364' }, // GRIS - CAPTURADO
    { statusId: '9', border: '4px solid #006360', color: '#006360' }, // VERDE -  VALIDADA */
  ];

  constructor() {}

  getColorBorder(estatus: string) {
    if (estatus) {
      return this.colors.filter((item) => item.statusId === estatus)[0].border;
    }
    return 0;
  }

  getColorBorderAuth(estatus: string) {
    if (estatus) {
      return this.colorsStatus.filter((item) => item.statusId === estatus)[0].border;
    }
    return 0;
  }

  getColor(estatus: string) {
    if (estatus) {
      return this.colors.filter((item) => item.statusId === estatus)[0].color;
    }
    return 0;
  }
}
