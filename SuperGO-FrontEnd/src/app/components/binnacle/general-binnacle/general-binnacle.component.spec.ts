import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralBinnacleComponent } from './general-binnacle.component';

describe('GeneralBinnacleComponent', () => {
  let component: GeneralBinnacleComponent;
  let fixture: ComponentFixture<GeneralBinnacleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralBinnacleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralBinnacleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
