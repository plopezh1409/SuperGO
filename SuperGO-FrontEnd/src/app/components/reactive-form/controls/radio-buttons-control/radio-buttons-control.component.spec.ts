import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonsControlComponent } from './radio-buttons-control.component';

describe('RadioButtonsControlComponent', () => {
  let component: RadioButtonsControlComponent;
  let fixture: ComponentFixture<RadioButtonsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioButtonsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
