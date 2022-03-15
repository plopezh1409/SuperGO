import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralmonetComponent } from './general-monet.component';

describe('generalmonetComponent', () => {
  let component: GeneralmonetComponent;
  let fixture: ComponentFixture<GeneralmonetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralmonetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralmonetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
