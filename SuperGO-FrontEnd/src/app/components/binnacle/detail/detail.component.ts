import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit, OnChanges {
  @ViewChild('tabExc') table: ElementRef;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @Output() Status = new EventEmitter<boolean>();
  @Input() detail: any;
  @Input() voucher: any = [];
  @Input() invoice: string;

  public dataSource = new MatTableDataSource<any>();
  public operation: string;
  public count: number;
  public evidence: string;
  public Mensaje: string;
  public Mensaje2: string;
  public pjsn: string;
  public statusVoucher: boolean;
  decimalPipe = new DecimalPipe(navigator.language);
  obs!: Observable<any>;
  detailClean: any = [];
  showFiller = false;
  search = '';
  InstanceAttribute: any;
  solicitudeId: string;


  constructor(
    private readonly elementRef: ElementRef,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute
  ) {
    this.evidence = '';
    this.operation = '';
    this.count = 0;
    this.pjsn = '';
    this.invoice = '';
    this.table = this.elementRef.nativeElement;
    this.Mensaje = '';
    this.Mensaje2 = '';
    this.statusVoucher= true;
    this.solicitudeId = route.snapshot.paramMap.get('solicitude') as string;
  }
  
  getObjeto(Obj: any, subObj: any, transacciones: any) {
    if (Obj != "DETALLE ")
    {
      transacciones = `${transacciones} <h3 class="Titulo">${Obj.toUpperCase()}</h3><span class="SpaSub">`;
    }
      
    transacciones = `${transacciones}${this.getTransacciones(subObj)}`;
    return transacciones;
  }

  getDatosGuion(Obj: any, subObj: any, transacciones: any){
    transacciones = `${transacciones} <h5 class="Subtitulo">${Obj}:</h5>&nbsp;`;
    this.count = subObj.indexOf('-');
    if (this.count > 0) {
      const dato = subObj.split('-', 2);
      transacciones =`${transacciones} <h5 class="Subtitulo2"> ${dato[1]}</h5>&nbsp;&nbsp;` 
    } else {
      transacciones = `${transacciones} <h5 class="Subtitulo2">${ subObj.length > 0 ? subObj: 'NA'}</h5>&nbsp;&nbsp;`;
    }
    return transacciones;
  }

  getDato(Obj: any, subObj: any, transacciones: any) {
    if (Obj === "0" || Obj === "MENSAJE") {
      this.Mensaje = subObj.split(':', 2);
      transacciones = `${transacciones} <h5 class="MensajeError">OPERACIÓN FALLIDA: ${this.Mensaje} </h5>`;
    }
    else if (Obj === "NUMERO DE OPERACION" || Obj === "NUMERO DE RASTREO") {
      transacciones = `${transacciones} <h3 class="MensajeExitoso">${Obj}: ${subObj} </h3>` ;
      this.Status.emit(this.statusVoucher);
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
      transacciones =  `${transacciones}</span>`;
    }
    this.pjsn = transacciones;
    return transacciones;
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {    
    const petitions:any = [];
    this.detailClean = this.detail.transactions; 

    //Optimizacion de memoria del navegador
    if(this.detailClean && this.detailClean.length>0)
    {
      this.detailClean.forEach((elem: any) => {
        petitions.push(this.getTransacciones(elem));
      });
    }

    this.dataSource = new MatTableDataSource<any>(petitions);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.obs = this.dataSource.connect();    
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

  descargarExcel() {
    const objlist: string[] = [];
    
    if (this.solicitudeId == '10') { //Consulta de saldo
      const objlist2: string[] = [];
      console.log('this.detailClean ', this.detailClean);
      console.log('this.detailClean.value ', this.detailClean.key);
      this.detailClean.forEach((tx: any) => {
        const tx1 = tx['Consultas de saldos'];
        const tx2 = tx['Informacion de retencion'];
        tx2.Cuenta = tx1.cuenta;
        tx2.Nombre = tx1.Nombre;

        let _objJson = `{`;
        _objJson = this.getPlaneObject(tx1, '', _objJson);
        _objJson = _objJson.substring(0, _objJson.length - 1);
        _objJson = `${_objJson} }`;
        objlist.push(JSON.parse(_objJson));

        let _objJson2 = `{`;
        _objJson2 = this.getPlaneObject(tx2, '', _objJson2);
        _objJson2 = _objJson2.substring(0, _objJson2.length - 1);
        _objJson2 = `${_objJson2} }`;
        objlist2.push(JSON.parse(_objJson2));
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(objlist, {header: ["Nombre","cuenta","Saldo contable","Saldo retenido","Saldo disponible"]});
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      ws['!cols'] = [{wch: 40},{wch: 22}, {wch: 22}, {wch: 22},{wch: 22}];            
      XLSX.utils.book_append_sheet(wb, ws, 'Consulta de saldo');

      //const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(objlist2,{header: ["Numero de retencion","Cuenta","Monto","Referencia","Usuario","Fecha"]});
      const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.detailClean);
      ws2['!cols'] = [{wch: 40},{wch: 22}, {wch: 22}, {wch: 22},{wch: 22}];         
      XLSX.utils.book_append_sheet(wb, ws2, 'Consulta de retenciones')
  
      XLSX.writeFile(
        wb,
        `DetalleBitacora-${this.invoice}-${new Date().toISOString()}.xlsx`,
      );    
    } else{  //Flujo generico
    this.detailClean.forEach((tx: any) => {
      let _objJson = `{`;
      _objJson = this.getPlaneObject(tx, '', _objJson);
      _objJson = _objJson.substring(0, _objJson.length - 1);
      _objJson = `${_objJson} }`;
      objlist.push(JSON.parse(_objJson));
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(objlist);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DetalleBitacora');

    XLSX.writeFile(
      wb,
      `DetalleBitacora-${this.invoice}-${new Date().toISOString()}.xlsx`
    );
    }
  }

  getPlaneObject(tx: any, pattern: string, objJson: string) {
    Object.keys(tx).forEach((ky) => {
      if (typeof tx[ky] === 'object') {
        pattern = ky;
        objJson = `${this.getPlaneObject(tx[ky], pattern, objJson)}`;
      } 
      else 
      {
        const patt = pattern.trim().length > 0 ? `${pattern.trim()}_` : '';
        objJson = `${objJson}"${patt}${ky}":"${tx[ky]}",`;
      }
    });
    return objJson;
  }
}
