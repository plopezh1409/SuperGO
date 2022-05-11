import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinnacleRoutingModule } from './binnacle-routing.module';

//COMPONENTS
import { BinnacleComponent } from './binnacle.component';
import { CardsComponent } from './cards/cards.component';
import { FiltersComponent } from './filters/filters.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { DetailBinnacleComponent } from './detail-binnacle/detail-binnacle.component';
import { DetailComponent } from './detail/detail.component';

//MATERIAL
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//MODULES
import { ReactiveFormModule } from '../reactive-form/reactive-form.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@app/shared/shared.module';

//DEPENDENCIES
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPrintModule } from 'ngx-print';

//SERVICES
import { CommunicationService } from '@app/core/services/binnacle/communication.service';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralBinnacleComponent } from './general-binnacle/general-binnacle.component';
import { MatrixComponent } from './matrix/matrix.component';
import { VoucherComponent } from './voucher/voucher.component';
import { BinnacleService } from '@app/core/services/binnacle/binnacle.service';



@NgModule({
  declarations: [
    CardsComponent,
    FiltersComponent,
    BinnacleComponent,
    TimeLineComponent,
    DetailComponent,
    AuthorizationComponent,
    DetailBinnacleComponent,
    GeneralBinnacleComponent,
    MatrixComponent,
    VoucherComponent
  ],
  
  imports: [
    CommonModule,  
    MatIconModule,  
    BinnacleRoutingModule,    
    ReactiveFormModule,        
    MatPaginatorModule,   
    MatSortModule, 
    MatSlideToggleModule,
    IvyCarouselModule,
    MatTooltipModule,
    MatSidenavModule,
    PdfViewerModule,
    NgxPrintModule,
    MatInputModule,
    MatTabsModule,
    SharedModule,
    MatButtonModule
  ],
  exports: [MatIconModule, MatButtonModule],
  providers: [
    CommunicationService,
    BinnacleService
  ]
})

export class BinnacleModule { }