import { Component, OnInit, Injector, Input, ViewChild, ElementRef, Output, EventEmitter,
  OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Container } from '@app/core/models/capture/container.model';
import { AppComponent } from '@app/app.component';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';

import { CommunicationService } from '@app/core/services/binnacle/communication.service';
import { FilterService } from '@app/core/services/binnacle/filter.service';
import { FormService } from '@app/core/services/capture/form.service';
import { finalize, pluck } from 'rxjs/operators';
import { ReactiveForm } from '@app/core/models/capture/reactiveForm.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass']
})
export class FiltersComponent implements OnInit {
  @Input() filters: any[];
  @Input() cards: any = [];
  @Output() cardsEvent = new EventEmitter<any>();
  @ViewChild('table') table: ElementRef;

  public reactiveForm: ReactiveForm;
  public cardsOrigins = [];

  containers: Container[];
  public formArray: FormGroup[];
  public principalForm!: FormGroup;
  private readonly formService: FormService;
  public binnacleService: BinnacleService;
  public communicationService: CommunicationService;  
  public filterService: FilterService;
  public idModule: string | null;

  constructor(
    public appComponent: AppComponent,
    public injector: Injector,    
    private readonly elementRef: ElementRef,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.formService = this.injector.get<FormService>(FormService);
    this.binnacleService = this.injector.get<BinnacleService>(BinnacleService);
    this.communicationService = this.injector.get<CommunicationService>(CommunicationService);    
    this.filterService = this.injector.get<FilterService>(FilterService);

    this.reactiveForm = new ReactiveForm();
    this.formArray = [];
    this.containers = [];
    this.idModule = null;
    this.filters=[];
    console.log("OKAKAKAKKAKA")
    this.table = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.idModule = this.activatedRoute.snapshot.paramMap.get('idModule');
    if (this.idModule != null) {
      this.getPetitionData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  getFormGroup(nombre: string) {
    return this.principalForm.get(nombre) as FormGroup;
  }

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
        this.getFilter();
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

  aplicarFiltro(event: Event): void {
    const dataSource: any = this.communicationService.receiveDataSource;
    const ValorFiltro = (event.target as HTMLInputElement).value;
    dataSource.filter = ValorFiltro.trim().toLowerCase();
    this.communicationService.sendDataSource(dataSource);

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  getFilter() {    
    const selectionCriteria = this.reactiveForm.principalForm;
    this.cardsOrigins = this.filterService.getFilter(
      this.cards,
      selectionCriteria!
    );
    this.cardsEvent.emit(this.cardsOrigins);
  }

}
