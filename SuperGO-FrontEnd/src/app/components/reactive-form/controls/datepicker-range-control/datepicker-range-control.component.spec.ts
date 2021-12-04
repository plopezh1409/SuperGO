import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerRangeControlComponent } from './datepicker-range-control.component';

describe('DatepickerRangeControlComponent', () => {
  let component: DatepickerRangeControlComponent;
  let fixture: ComponentFixture<DatepickerRangeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerRangeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerRangeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
