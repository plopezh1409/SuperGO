import { NgModule } from "@angular/core";
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

//IMPORTAR SOLAMENTE LOS COMPONENTES DE MATERIAL QUE SEAN REQUERIDOS
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

//COMPONENTES
import { ElevatorComponent } from "./elevator/elevator.component";
import { PaginaNoEncontradaComponent } from "./pagina-no-encontrada/pagina-no-encontrada.component";

//DIRECTIVAS
import { DropArchivoDirective } from "./directives/drop-archivo.directive";
import { AttributeDirective } from "./directives/attribute.directive";

//PIPES
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { ProgressComponent } from './progress/progress.component';
import { SearchComponent } from "./search/search.component";
import { TestComponent } from './test/test.component';
import { MaskDirective } from "./directives/mask.directive";
import { MaskTextDirective } from "./directives/mask-text.directive";

@NgModule({    
    declarations:[
        AttributeDirective,       
        DropArchivoDirective,
        ElevatorComponent,
        PaginaNoEncontradaComponent,
        ProgressComponent,
        SearchComponent,
        TestComponent,
        MaskDirective,
        MaskTextDirective
    ],
    imports:[
        CommonModule,  
        FormsModule,
        MatCardModule,      
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterModule,
        SweetAlert2Module.forRoot()        
    ],
    exports:[
        AttributeDirective,   
        DropArchivoDirective,
        ElevatorComponent,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule, 
        MatIconModule,
        MatInputModule,
        ProgressComponent,
        ReactiveFormsModule,     
        SweetAlert2Module,
        SearchComponent,
        TestComponent,  
        MaskDirective,
        MaskTextDirective
    ],
    providers:[
    ]
})
export class SharedModule{}