import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

//MATERIAL
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/services/sesion/auth.service';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';
import { CommunicationService } from '@app/core/services/binnacle/communication.service';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { finalize, pluck } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.sass']
})

//Estatus Cards
//1.-Presolicitud
//2.-Capturada
//3.-Preautorizada
//4.-Autorizada
//5.-Procesada
//6.-Rechazada
//7.-Cancelada
//8.-Sin Procesar

export class CardsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() cards = [];
  @Output() CardsO = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  public data: Body[];
  public reactiveForm: ReactiveForm;

  obs!: Observable<any>;
  public dataSource = new MatTableDataSource<CardElement>();

  decimalPipe = new DecimalPipe(navigator.language);
  public idPetition: string | null;
  public namePetition: string | null;
  public solicitudes: any;
  public selection: any;
  public typeRequest: string;
  public evidence: string;
  public objlist: Array<CardElement> = [];
  private readonly authService: AuthService;

  cardsSelected: any[] = [];
  subscriptionModule: any;
  role: any;

  constructor(
    public binnacleService: BinnacleService,
    public communicationService: CommunicationService,
    private readonly router: Router,
    public appComponent: AppComponent,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly injector: Injector,
  ) {
    this.solicitudes = [];
    this.idPetition = null;
    this.namePetition = '';
    this.typeRequest = '';
    this.evidence = '';
    this.data = [];
    this.reactiveForm = new ReactiveForm();
    this.authService = this.injector.get<AuthService>(AuthService);
  }

  ngOnInit(): void {
    this.getBinnacleData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.cards == []) {
      this.getBinnacleData();
    } else {
      this.experiment(this.cards);
    }    
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${this.decimalPipe.transform(length)}`;
    };

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getBinnacleData() {
    this.appComponent.showLoader(true);
    this.binnacleService
      .getcards()
      .pipe(pluck('response'),finalize(() => {this.appComponent.showLoader(false);}))
      .subscribe((data) => {                
        if(data)
        {
          this.CardsO.emit(data);
          this.cards = data;
          this.solicitudes = this.cards;

          this.experiment(data);
        }
        else{
          Swal.fire({
            html: `<div class="titModal">Aviso</div><br/>No se obtuvo información de las solicitudes`,
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
            heightAuto: false
          });
        }        
      });
  }

  experiment(data: any) {
    this.objlist = [];
    data.forEach((tx: any) => {
      let _objJson = `{`;
      _objJson = this.getPlaneObject(tx, '', _objJson);
      _objJson = _objJson.substring(0, _objJson.length - 1);
      _objJson = `${_objJson} }`;
      this.objlist.push(JSON.parse(_objJson) as CardElement);
    });
    this.cardsCarga(this.objlist);
  }

  getPlaneObject(tx: any, pattern: string, objJson: string) {
    Object.keys(tx).forEach((ky) => {
      if (typeof tx[ky] === 'object') {
        pattern = ky;
        objJson = `${this.getPlaneObject(tx[ky], pattern, objJson)}`;
      } 
      else {
        const patt = pattern.trim().length > 0 ? `${pattern.trim()}_` : '';
        objJson = `${objJson}"${patt}${ky}":"${tx[ky]}",`;        
      }
    });
    return objJson;
  }

  cardsCarga(cards: any) {
    if (cards != null) {
      this.dataSource = new MatTableDataSource<CardElement>(cards);
      this.changeDetectorRef.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.obs = this.dataSource.connect();
    }
  }


  showDetail(folio: string, empleado: string, statusFolio: string, capturador: string, solicitude: string) {    
    // tipoSol: string,idtipoSol:string
    const usuario = this.authService.usuario;        

    this.subscriptionModule = this.authService.roleName.subscribe(roleName => {
      if (usuario && roleName !== 'null') {
        this.role = roleName;        
      }
    });
    
    if (statusFolio == '1') 
    {
      //Cualquier operador o capturista  puede guardar evidencia aunque no haya sido su solicitud si el responsable no se encuentra, 
      //sin embargo, se envia el mensaje de que por recomendacion debe de subir el archivo quien capturo dicha solicitud
      if (this.role == 'OPERADOR' || this.role == 'CAPTURISTA') 
      { 
        this.router.navigateByUrl(`binnacle/6/evidenceFile/${statusFolio}/${folio}`);                       
      } 
      else 
      {
        this.failLoadEvidence(capturador);            
      }
    } else if (solicitude == '5' ||  solicitude == '6'){ //SPEI EGLOBAL - SPEI PROSA
      this.router.navigateByUrl(`binnacle/6/detalle/${statusFolio}/${folio}/8/${solicitude}`);
    }else{
      this.router.navigateByUrl(`binnacle/6/detalle/${statusFolio}/${folio}/7/${solicitude}`);
    }
  }

  failLoadEvidence(capturador:string)
  {
    Swal.fire({
      html: `<div class="titModal">Falta Cargar Archivo de Evidencia</div>                        
                          <br/>
                          Favor de comunicarse con <br/> <strong>${capturador} </strong> <br/> para que realice la carga del archivo.
                        <br/>`,
      allowOutsideClick: false,
      confirmButtonText: 'Ok',
      heightAuto: false
    });    
  }


  sendData(
    employeeNumber: string,
    employeeName: string,
    amount: string,
    operation: string
  ) {
    const json: any = {
      employeeNumber,
      employeeName,
      amount,
      operation,
    };
    this.communicationService.sendData(json);
  }

}

export interface CardElement {
  body_area: string;
  body_direccion: string;
  body_monto: string;
  body_operacion: string;
  body_pais: string;
  body_registros: string;
  body_solicitud: string;
  footing_date: string;
  footing_employee: string;
  footing_name: string;
  footing_time: string;
  header_invoice: string;
  request_id: string;
  request_name: string;
  status_id: string;
  status_name: string;
}