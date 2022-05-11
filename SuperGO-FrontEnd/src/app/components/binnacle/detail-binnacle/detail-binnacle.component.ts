import { Component, Injector, OnInit, SimpleChanges, OnChanges, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from '@app/core/services/binnacle/detail.service';
import { EvidenceService } from '@app/core/services/binnacle/evidence.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { AppComponent } from '@app/app.component';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';
import { AuthService } from '@app/core/services/sesion/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-detail-binnacle',
  templateUrl: './detail-binnacle.component.html',
  styleUrls: ['./detail-binnacle.component.sass']
})
export class DetailBinnacleComponent implements OnInit, OnChanges {

  @Input() info: any;
  @ViewChild(PdfViewerComponent, { static: false })

  public evidence: string;
  public response;
  public authorization;
  public matrix;
  public detail;
  public timeline;
  public voucher;
  public muestra = false;
  public count: number;

  steps = 0;
  bef = false;
  aft = false;
  public invoice: string;
  public statusCard: string;
  public solicitude: string;
  statusVal: number;
  pdfSrc: any;
  public getDetalle;
  mostrarAuth: any;
  mostrarComp: any;
  private readonly authService: AuthService;  
  public readonly binnacleService: BinnacleService;
  private readonly evidenceService: EvidenceService;
  public readonly detailService: DetailService;

  constructor(    
    private readonly injector: Injector,    
    private readonly appComponent: AppComponent, 
    private readonly activeRoute: ActivatedRoute) 
    {
    this.binnacleService = this.injector.get<BinnacleService>(BinnacleService);
    this.evidenceService = this.injector.get<EvidenceService>(EvidenceService);
    this.detailService = this.injector.get<DetailService>(DetailService);
    this.evidence = '';
    this.response = '';
    this.authorization = [] as any;
    this.detail = []as any;
    this.matrix = [] as any;
    this.timeline = [] as any;
    this.voucher = [] as any;
    this.evidence = '';
    this.appComponent.showInpImage(false);
    this.appComponent.showBoolImg(false);
    this.appComponent.showLogo = true;
    this.invoice = this.activeRoute.snapshot.paramMap.get('folio') as string;
    this.statusCard = this.activeRoute.snapshot.paramMap.get('status') as string;
    this.solicitude = this.activeRoute.snapshot.paramMap.get('solicitude') as string;
    this.statusVal = 0;
    this.count = 0;
    this.mostrarAuth = false;
    this.mostrarComp = false;
    this.getDetalle = [] as any[];    
    this.authService = this.injector.get<AuthService>(AuthService);    
  }

  ngAfterViewInit(){

  }
  ngOnChanges(changes: SimpleChanges) {         
    if (this.detail == '5') {
      this.statusVal = 0;
    }

  }

  ngOnInit(): void {
    this.getDetail(this.invoice);
    this.getEvidence(this.invoice);
  }

  getDetail(invoice: string | null) {
    this.binnacleService.getResponse(invoice).subscribe(
      (data) => {        
        if (data.response != null) {
          console.log('data.response ', data.response);
          this.timeline = data.response.timeline;
          this.matrix = data.response.matriz;
          this.detail = data.response.operation;
          
          this.visibleAuthorization(this.matrix, invoice);
        }
      });
  }

  visibleAuthorization(matrix: any, folio: any) {
    let status = 0;
    const usuario = this.authService.usuario;
    const usuarioauth = usuario.employee;
    let empleadosPend = 0;
    let esAutorizadorDeMatriz = 0;
    let esValidador = 0;
    let esValidadorDeMatriz = 0;

    if (usuarioauth.length > 0) {
      if (Number(this.statusCard) == 5){
        console.log('ENTRAMOS WOOOHOO ', this.mostrarComp);
        this.mostrarComp = true;
      }

      this.matrix.forEach((el: any) => {        
        const element = el.authorizing.id.trim();
        const element2 = el.status.id.trim();
        const element3 = el.level.trim();
        const level = Number(element3);
        const usuarioLog = Number(usuarioauth);
        const id = Number(element);
        status = Number(element2);

        if (id === usuarioLog && status === 1)
          this.mostrarAuth = false;      
            
        if (status === 2)
          empleadosPend = 1;
        
        if (level === 0 && status === 2 && id === usuarioLog)      
          esValidadorDeMatriz = 1;
        
        if (level === 0 && status === 2)         
          esValidador = 1;
        
        if (level > 0 && status === 2 && id === usuarioLog)         
          esAutorizadorDeMatriz = 1;
        
      });
      if (empleadosPend > 0 && Number(this.statusCard) < 5) {

        if (esAutorizadorDeMatriz > 0 && esValidador === 0) {
          this.statusVal = 4;
          swal.fire({
            html: `<div class="titModal">Aviso</div>
                                <br/>
                                  Falta tu autorizacion, favor de autorizar
                                <br/>`,
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
            heightAuto: false
          });
        }

        if (esValidadorDeMatriz > 0) {
          this.statusVal = 4;
          swal.fire({
            html: `<div class="titModal">Aviso</div>
                                <br/>
                                  Falta tu validación, favor de autorizar
                                <br/>`,
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
            heightAuto: false
          });
        }

        if(esValidadorDeMatriz >0 || (esAutorizadorDeMatriz>0 && esValidador===0))
        this.mostrarAuth=true;
      }
      if (this.statusCard === '6') 
        this.mostrarAuth = false;
    }
  }

  getEvidence(invoice: string | null) {
    this.evidenceService.getEvidence(invoice).subscribe(
      (data) => {
        if (data.response != null && data.response != '') {          
          this.pdfSrc = this.evidenceService.base64ToArrayBuffer(data.response);
        } else {
          this.pdfSrc = null;
        }
      }
    );
  }

  refresh($event: any) {
    this.mostrarAuth = $event.status;
    this.matrix = $event.matrix;
    this.timeline = $event.timelime;
    this.detail = $event.detail;    
    this.statusVal = 0;
    this.actualizaVoucher(null);
  }
    actualizaVoucher($event:boolean | null){
      setTimeout(()=>this.mostrarComp = $event);
      
  }

}
