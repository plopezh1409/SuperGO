import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietiesComponent } from './societies.component';

describe('societiesComponent', () => {
  let component: SocietiesComponent;
  let fixture: ComponentFixture<SocietiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocietiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
