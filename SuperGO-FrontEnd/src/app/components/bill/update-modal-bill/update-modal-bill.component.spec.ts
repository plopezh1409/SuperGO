import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalBillComponent } from './update-modal-bill.component';

describe('UpdateModalBillComponent', () => {
  let component: UpdateModalBillComponent;
  let fixture: ComponentFixture<UpdateModalBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
