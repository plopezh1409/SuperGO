import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigureTableComponent } from './figure-table.component';

describe('FigureTableComponent', () => {
  let component: FigureTableComponent;
  let fixture: ComponentFixture<FigureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FigureTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FigureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
