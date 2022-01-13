import { ComponentFixture, TestBed } from '@angular/core/testing';

import { invoicesComponent } from './invoices.component';

describe('invoicesComponent', () => {
  let component: invoicesComponent;
  let fixture: ComponentFixture<invoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ invoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(invoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
