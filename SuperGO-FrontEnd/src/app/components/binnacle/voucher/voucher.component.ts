import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';
import 'moment/locale/es';
import { CommunicationService } from '@app/core/services/binnacle/communication.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.sass']
})
export class VoucherComponent implements OnInit, OnChanges {

  @Input() voucher: any = [];

  voucherInfo = {
    img: 'assets/image/logo1.png',
    enterprice: 'BANCO AZTECA',
    todayDate: moment().format('LL'),
    subTitle: 'Información general',
    clauses: [
      {
        clause:
          'LA CUENTA DE ORIGEN DEBERÁ CONTAR CON LOS FONDOS SUFICIENTES EN LA FECHA DE OPERACIÓN DE LA TRANSFERENCIA.',
      },
      {
        clause:
          'ESTE COMPROBANTE NO ES VÁLIDO SI PRESENTA TACHADURAS O ENMENDADURAS.',
      },
      {
        clause:
          'LA OPERACIÓN SE REALIZARÁ EXITOSAMENTE SOLO SI LOS DATOS PROPORCIONADOS SON CORRECTOS.',
      },
      {
        clause:
          'RECUERDA GUARDAR TUS COMPROBANTES PARA LLEVAR EL HISTORIAL DE TU CUENTA. ',
      },
    ],
    copyright: 'DERECHOS RESERVADOS 2021©',
  };
  detailClean: any = [];
  public count: number;
  public pjsn: string;
  public valuesBinnacle: any;
  Mensaje: any;
  petitions:any = [];

  constructor(
    private readonly communicationService: CommunicationService
  ) {
    this.count = 0;
    this.pjsn = '';
    this.petitions=[];
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.detailClean = this.voucher.transactions;

    //Optimizacion de memoria del navegador
    if(this.detailClean && this.detailClean.length>0)
    {
      this.detailClean.forEach((elem: any) => {
        this.petitions.push(this.getTransacciones(elem));
      });
    }

  }

  onKey(input: any) {
    this.detailClean.forEach((el: any) => {
      let encontrado = false;
      for (let i = 0; i < el.length; i++) {        
        const cadena = el.value.toLowerCase();
        const termino = input.target.value;
        const posicion = cadena.indexOf(termino);
        if (posicion != -1) {
          encontrado = true;
        }
      }
      if (encontrado) {
        this.detailClean.push(el);
      }
    });
  }

  getData() {
    this.valuesBinnacle = this.communicationService.receiveData;
  }

  getObjeto(Obj: any, subObj: any, transacciones: any) {
    if (Obj != 'DETALLE '){
      transacciones = `${transacciones} <h3 class="Titulo">${Obj.toUpperCase()}</h3><span class="SpaSub">`;
    }
      
    transacciones =`${transacciones}${this.getTransacciones(subObj)}`;
    return transacciones;
  }
  getDatosGuion(Obj: any, subObj: any, transacciones: any){
    transacciones = `${transacciones} <h5 class="Subtitulo">${Obj}:</h5>&nbsp;`;
    this.count = subObj.indexOf('-');
    if (this.count > 0) {
      const dato = subObj.split('-', 2);
      transacciones = `${transacciones} <h5 class="Subtitulo2"> ${dato[1]} </h5>&nbsp;&nbsp;`;
    } else {
      transacciones = `${transacciones} <h5 class="Subtitulo2">${subObj}</h5>&nbsp;&nbsp;`;
    }
    return transacciones;
  }

  getDato(Obj: any, subObj: any, transacciones: any) {
    if (Obj === '0' || Obj === 'MENSAJE') {
      this.Mensaje = subObj.split(':', 2);
      transacciones = `${transacciones} <h5 class="MensajeError">OPERACION FALLIDA: ${this.Mensaje} </h5>`;
    }
    else if (Obj === "NUMERO DE OPERACION" || Obj === "NUMERO DE RASTREO") {
      transacciones = `${transacciones} <h3 class="MensajeExitoso">${Obj}: ${subObj} </h3>` ;
    } else {
      transacciones = this.getDatosGuion(Obj,subObj, transacciones);
    }
    return transacciones;

  }
  getTransacciones(tran: any) {
    let transacciones = '';
    if (tran) {
      Object.keys(tran).forEach((ky) => {
        if (typeof tran[ky] === 'object') {
          transacciones = this.getObjeto(ky.toUpperCase(), tran[ky], transacciones);
        } else {
          transacciones = this.getDato(ky.toUpperCase(), tran[ky], transacciones);
        }
      });
      transacciones = `${transacciones} </span>`;
    }
    this.pjsn = transacciones;
    return transacciones;
  }

}
