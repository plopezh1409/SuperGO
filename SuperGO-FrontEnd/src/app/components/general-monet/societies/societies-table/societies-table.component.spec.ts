import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietiesTableComponent } from './societies-table.component';

describe('SocietiesTableComponent', () => {
  let component: SocietiesTableComponent;
  let fixture: ComponentFixture<SocietiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocietiesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
