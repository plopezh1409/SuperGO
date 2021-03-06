import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/sesion/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  @Input() showImage: boolean;
  inputSearch: string;
  @Input() boolImg: boolean;
  @Input() initIN: boolean;
  placeHolderInput = false;
  valueInput = '';
  modules: any[] = [];
  petitions: any[] = [];
  copyPetitions: any[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.showImage = true;
    this.boolImg = true;
    this.initIN = false;
    this.inputSearch = '';
  }
  ngOnInit() {
    this.modules = this.authService.usuario.modules;
    this.modules.forEach(element => {
      const mod = element.module;
      if (mod.operation) {
        mod.operation.forEach((elemen: any) => {
          if (elemen.id !== '') {
            this.petitions.push({
              categories: mod,
              subcategories: elemen,
              string: `${mod.name}  /${elemen.name}`
            });
          }
        });

      }
    });
  }

  onKey(data: any) {
    this.valueInput = data.value;
    if (this.boolImg) {
      if (data.value.length > 0) {
        this.showImage = false;
      } else {
        this.showImage = true;

      }
    }
    if (data.value.length > 0) {
      this.placeHolderInput = true;
    } else {
      this.placeHolderInput = false;
    }

    this.copyPetitions = [];
    for (let i = 0; i < this.petitions.length; i++) {
      const element = this.petitions[i];
      const cadena = element.string.toLowerCase();
      const termino = this.valueInput;
      const posicion = cadena.indexOf(termino);
      if (posicion !== -1) {
        this.copyPetitions.push(element);
      }
    }

  }

  clean(target: any) {
    this.inputSearch = '';
    this.placeHolderInput = false;
    target.parentElement.children[1].value = '';
    if (this.boolImg) {
      this.showImage = true;
    }
  }

  redirect(searchModule: any) {
    this.inputSearch = '';
    this.valueInput = '';
    this.placeHolderInput = false;
    if (this.boolImg) {
      this.showImage = true;
    }
    const module = this.authService.getModuleByUrl(searchModule.url);
    if (module) {
      this.authService.getRoleName(module.role.name);
      this.router.navigateByUrl(searchModule.url);
    }
  }
}
