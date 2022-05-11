import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBinnacleComponent } from './detail-binnacle.component';

describe('DetailBinnacleComponent', () => {
  let component: DetailBinnacleComponent;
  let fixture: ComponentFixture<DetailBinnacleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBinnacleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBinnacleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
