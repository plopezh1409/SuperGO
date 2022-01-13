import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalInvoicesComponent } from './update-modal-invoices.component';

describe('UpdateModalInvoicesComponent', () => {
  let component: UpdateModalInvoicesComponent;
  let fixture: ComponentFixture<UpdateModalInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
