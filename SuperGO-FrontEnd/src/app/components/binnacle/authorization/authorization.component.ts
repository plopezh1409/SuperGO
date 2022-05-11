import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';
import { FormService } from '@app/core/services/capture/form.service';
import { AuthService } from '@app/core/services/sesion/auth.service';
import { NGXLogger } from 'ngx-logger';
import { Container } from '@app/core/models/capture/container.model';
import { finalize, pluck } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';
import { AuthorizationService } from '@app/core/services/binnacle/authorization.service';
import { CommunicationService } from '@app/core/services/binnacle/communication.service';
import { Control } from '@app/core/models/capture/controls.model';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.sass']
})
export class AuthorizationComponent implements OnInit, OnChanges {
  
  @Output() public Resp = new EventEmitter<{
    status: any;
    matrix: any;
    timelime: any;
    detail: any;
    voucher: any;
  }>();
  
  public reactiveForm: ReactiveForm;
  public alignContent: string;
  public status: string;
  private readonly formService: FormService;
  public idModule: string | null;
  public principalForm!: FormGroup;
  public comentario: string;
  public amountValid: number;
  public net: string;
  public mensaje: string;
  public mostrar: any;
  public matrix;
  public detail;
  public timeline;
  public Title: string;
  public invoice: string;
  private readonly authService: AuthService;
  public containers: Container[];
  public voucherStatus: boolean;
  public binnacleService: BinnacleService;
  private readonly authoriza: AuthorizationService;
  public communicationService: CommunicationService;
  public idSolicitud: string | null;

  @Input() authorization = [];
  labels = {
    autorizar: 'Autorizado',
    rechazar: 'Rechazado',
  };

constructor(
    private readonly logger: NGXLogger,
    public injector: Injector,
    public appComponent: AppComponent,
    private readonly _route: ActivatedRoute,
    private readonly activeRoute: ActivatedRoute
  ) {
    this.formService = this.injector.get<FormService>(FormService);
    this.binnacleService = this.injector.get<BinnacleService>(BinnacleService);
    this.authoriza =
      this.injector.get<AuthorizationService>(AuthorizationService);
    this.communicationService =
      this.injector.get<CommunicationService>(CommunicationService);

    this.reactiveForm = new ReactiveForm();
    this.containers = [];
    this.alignContent = 'vertical';
    this.status = '';
    this.idModule = null;
    this.comentario = '';
    this.amountValid = 0;
    this.net = '';
    this.invoice = this.activeRoute.snapshot.paramMap.get('folio') as string;
    this.mensaje = '';
    this.mostrar = false;
    this.voucherStatus = true;
    this.authService = this.injector.get<AuthService>(AuthService);
    this.detail = [] as any;
    this.matrix = [] as any;
    this.timeline = [] as any;
    this.Title = '';
    this.idSolicitud=null;
  }
  
  ngOnInit(): void {
    this.idSolicitud = this._route.snapshot.paramMap.get('idSolicitud');
    if(this.idSolicitud!=null){
      this.getPetitionData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {}
  
  getPetitionData() {
    this.appComponent.showLoader(true);
    this.formService
      .getFormByModule({ idModule: this.idModule })
      .pipe(
        pluck('response'),
        finalize(() => {
          this.appComponent.showLoader(false);
        })
      )
      .subscribe((data: any) => {
        this.containers = data;
        this.setContainers(this.containers);
      });
  }

  setContainers(_newContainers?: Container[]) {
    if (_newContainers != undefined && _newContainers != null) {
      this.containers = _newContainers;
    }

    if (this.containers != null && this.containers.length > 0) {
      const form: any = {};
      this.containers.forEach((elem) => {
        const formGroup = this.reactiveForm.buildFormControl(elem);
        form[elem.idContainer] = formGroup;
      });
      this.reactiveForm.principalForm = new FormGroup(form);
    }
  }

  getdata() {
    let jsonPetition = `{ "info":{`;
    this.containers.forEach((cont: Container) => {
      const _formAux = this.reactiveForm.principalForm?.get(
        cont.idContainer
      ) as FormGroup;
      jsonPetition = `${jsonPetition} "${cont.idContainer}":{`;
      cont.controls.forEach((x: Control) => {
        const ctrl: Control = Object.assign(new Control(), x);
        switch (ctrl.controlType) {
          case 'datepicker':
            jsonPetition = `${jsonPetition} "${
              ctrl.ky
            }" : "${ctrl.getDatePickerValue(_formAux)}",`;
            break;
          case 'decimal':
            jsonPetition = `${jsonPetition} "${
              ctrl.ky
            }" : "${ctrl.getDecimalValue(_formAux)}",`;
            break;
          case 'label':
            break;
          case 'checkbox':
            jsonPetition = `${jsonPetition} "${
              ctrl.ky
            }" : "${ctrl.getCheckBoxValue(_formAux)}",`;
            break;
          case 'dropdown':
            jsonPetition = `${jsonPetition} "${
              ctrl.ky
            }" : "${ctrl.getDropDownValue(_formAux)}",`;
            break;
          case 'autocomplete':
            jsonPetition = `${jsonPetition} "${
              ctrl.ky
            }" : "${ctrl.getAutocompleteValue(_formAux)}",`;
            break;
          case 'textarea':
            jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl
              .getInfoValue(_formAux)
              .replace(/\n/g, ' ')}",`;
            break;
          default:
            jsonPetition = `${jsonPetition} "${ctrl.ky}" : "${ctrl.getInfoValue(
              _formAux
            )}",`;
            break;
        }
      });
      jsonPetition = jsonPetition.substring(0, jsonPetition.length - 1);
      jsonPetition = `${jsonPetition} },`;
    });
    jsonPetition = jsonPetition.substring(0, jsonPetition.length - 1);
    jsonPetition = `${jsonPetition}}} `;
    const newJson = JSON.parse(jsonPetition);

    if (this.idModule != '8') {
      this.comentario = newJson.info[17].COMENTARIO;
      this.net = newJson.info[17].NETIQ;
    } else {
      this.comentario = newJson.info[27].COMENTARIO;
      this.net = newJson.info[27].NETIQ;
      this.amountValid = newJson.info[27].MONTOVALIDACION;
    }
  }

  refresh(folio: string) {
    this.binnacleService.getResponse(folio).subscribe((data) => {
      if (data.response != null) {
        this.timeline = data.response.timeline;
        this.matrix = data.response.matriz;
        this.detail = data.response.operation;
        this.Resp.emit({
          status: this.mostrar,
          matrix: this.matrix,
          timelime: this.timeline,
          detail: this.detail,
          voucher: this.voucherStatus,
        });
      }
    });
  }

  authorize() {
    if (!this.reactiveForm.isValid(this.containers)) {
      Swal.fire({
        html: `<div class='titModal'>Sin Información</div><br/>Falta información para generar correctamente la Autorización.<br/>`,
      });
      return;
    }
    this.appComponent.showLoader(true);
    this.getdata();
    this.mensaje = 'Se realizó con éxito la autorización de la solicitud';
    this.Title = 'Autorizado';
    this.getAuthoriza(
      this.net,
      this.comentario,
      this.invoice,
      '1',
      this.labels.autorizar,
      this.amountValid
    );
  }

  reject() {
    if (!this.reactiveForm.isValid(this.containers)) {
      Swal.fire({
        html: `<div class='titModal'>Sin Información</div><br/>Falta información para generar correctamente el Reachazo.<br/>`,
      });
      return;
    }
    this.appComponent.showLoader(true);
    this.getdata();
    this.mensaje = 'Se realizó con éxito el rechazo de la solicitud';
    this.Title = 'Rechazado';
    this.getAuthoriza(
      this.net,
      this.comentario,
      this.invoice,
      '1',
      this.labels.rechazar,
      this.amountValid
    );
  }

  getAuthoriza(
    authentication: string | null,
    comment: string | null,
    folio: string | null,
    option: string | null,
    type: string | null,
    amountValid: number | null
  ) {
    if (amountValid != undefined && amountValid != null && amountValid != 0) {
      this.authoriza
        .getAuthorizationAmountValid(
          authentication,
          comment,
          folio,
          option,
          type,
          amountValid
        )
        .pipe(
          finalize(() => {
            this.appComponent.showLoader(false);
          })
        )
        .subscribe((data) => {
          if (data != null) {
            Swal.fire(this.Title, this.mensaje, 'success');
            this.refresh(this.invoice);
          }
        });
    } else {
      this.authoriza
        .getAuthorization(authentication, comment, folio, option, type)
        .pipe(
          finalize(() => {
            this.appComponent.showLoader(false);
          })
        )
        .subscribe((data) => {
          if (data != null) {
            Swal.fire(this.Title, this.mensaje, 'success');
            this.refresh(this.invoice);
          }
        });
    }
  }

}
