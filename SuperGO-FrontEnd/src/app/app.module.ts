//MODULOS DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {RouterModule} from '@angular/router';

//ENTORNOS
import { environment } from '@env/environment';

//COMPONENTES
import { AppComponent } from './app.component';

//MODULOS
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

//DEPENDENCIAS
import { LoggerModule } from 'ngx-logger';
import { NgFallimgModule } from 'ng-fallimg';
import {MatBreadcrumbModule} from 'mat-breadcrumb';


registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [
    AppComponent,    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    CoreModule,    
    MatBreadcrumbModule,    
    NgFallimgModule.forRoot({
      default: 'assets/image/user-not-found.png',
    }),
    LoggerModule.forRoot({
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      timestampFormat: 'dd-MM-yyyy HH:mm:ss',

      disableConsoleLogging: environment.disableConsoleLogging,
      disableFileDetails:false,
      proxiedSteps:3

    }),    
    RouterModule,
    SharedModule,    
  ],
  providers: [    
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MatNativeDateModule, useValue: 'es-MX' },      
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
