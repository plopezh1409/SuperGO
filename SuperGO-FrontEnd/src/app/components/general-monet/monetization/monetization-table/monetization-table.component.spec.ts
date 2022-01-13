import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizationTableComponent } from './monetization-table.component';

describe('MonetizationTableComponent', () => {
  let component: MonetizationTableComponent;
  let fixture: ComponentFixture<MonetizationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonetizationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonetizationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
