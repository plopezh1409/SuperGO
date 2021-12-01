import { ErrorHandler, NgModule, Optional, SkipSelf } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';

//MATERIAL
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

//COMPONENTES
import { EncabezadoComponent } from "./layout/encabezado/encabezado.component";
import { InicioComponent } from "./layout/inicio/inicio.component";
import { PieDePaginaComponent } from "./layout/pie-de-pagina/pie-de-pagina.component";
import { DialogTop } from "./layout/dialog/dialogTop/dialogTop.component";


//DEPENDENCIAS
import {MatBreadcrumbModule} from "mat-breadcrumb";

//SERVICIOS
import { SharedModule } from "@app/shared/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";


@NgModule({
    declarations:[
        EncabezadoComponent,
        InicioComponent,
        PieDePaginaComponent,
        DialogTop        
    ],
    imports:[    
        CommonModule,    
        HttpClientModule,
        MatBreadcrumbModule,        
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        RouterModule,          
        SharedModule,
        MatSnackBarModule
    ],    
    exports:[
        EncabezadoComponent,
        InicioComponent,
        PieDePaginaComponent,
        DialogTop        
    ]

})
export class CoreModule{
    constructor (@Optional() @SkipSelf() parentModule?: CoreModule) {
        if (parentModule) {
          throw new Error(
            'CoreModule  ya se encuentra cargado. Debe de ser importado solamente en el AppModule.');
        }
      }


}
