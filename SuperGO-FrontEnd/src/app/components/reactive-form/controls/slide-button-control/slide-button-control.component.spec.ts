import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideButtonControlComponent } from './slide-button-control.component';

describe('SlideButtonControlComponent', () => {
  let component: SlideButtonControlComponent;
  let fixture: ComponentFixture<SlideButtonControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideButtonControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideButtonControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
