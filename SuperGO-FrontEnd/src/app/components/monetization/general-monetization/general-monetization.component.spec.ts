import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMonetizationComponent } from './general-monetization.component';

describe('GeneralMonetizationComponent', () => {
  let component: GeneralMonetizationComponent;
  let fixture: ComponentFixture<GeneralMonetizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralMonetizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralMonetizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
