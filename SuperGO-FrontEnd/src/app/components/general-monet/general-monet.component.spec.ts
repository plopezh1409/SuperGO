import { ComponentFixture, TestBed } from '@angular/core/testing';

import { generalmonetComponent } from './general-monet.component';

describe('generalmonetComponent', () => {
  let component: generalmonetComponent;
  let fixture: ComponentFixture<generalmonetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ generalmonetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(generalmonetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
