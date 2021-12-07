import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralBillsComponent } from './general-bills.component';

describe('GeneralBillsComponent', () => {
  let component: GeneralBillsComponent;
  let fixture: ComponentFixture<GeneralBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
