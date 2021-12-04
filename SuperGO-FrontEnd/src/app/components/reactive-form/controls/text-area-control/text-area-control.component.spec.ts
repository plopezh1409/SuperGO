import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaControlComponent } from './text-area-control.component';

describe('TextAreaControlComponent', () => {
  let component: TextAreaControlComponent;
  let fixture: ComponentFixture<TextAreaControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextAreaControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
