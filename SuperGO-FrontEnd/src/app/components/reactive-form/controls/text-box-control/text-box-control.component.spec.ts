import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxControlComponent } from './text-box-control.component';

describe('TextBoxControlComponent', () => {
  let component: TextBoxControlComponent;
  let fixture: ComponentFixture<TextBoxControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextBoxControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
