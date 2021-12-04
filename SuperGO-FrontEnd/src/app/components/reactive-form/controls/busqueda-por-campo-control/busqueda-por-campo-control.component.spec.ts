import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaPorCampoControlComponent } from './busqueda-por-campo-control.component';

describe('BusquedaPorCampoControlComponent', () => {
  let component: BusquedaPorCampoControlComponent;
  let fixture: ComponentFixture<BusquedaPorCampoControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaPorCampoControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaPorCampoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
