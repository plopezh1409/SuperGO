import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaPorCampoMultipleControlComponent } from './busqueda-por-campo-multiple-control.component';

describe('BusquedaPorCampoMultipleControlComponent', () => {
  let component: BusquedaPorCampoMultipleControlComponent;
  let fixture: ComponentFixture<BusquedaPorCampoMultipleControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaPorCampoMultipleControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaPorCampoMultipleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
