import { ComponentFixture, TestBed } from '@angular/core/testing';

import { invoicesTableComponent } from './invoices-table.component';

describe('invoicesTableComponent', () => {
  let component: invoicesTableComponent;
  let fixture: ComponentFixture<invoicesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ invoicesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(invoicesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
