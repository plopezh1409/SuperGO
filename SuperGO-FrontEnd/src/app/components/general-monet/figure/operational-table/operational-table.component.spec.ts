import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalTableComponent } from './operational-table.component';

describe('OperationalTableComponent', () => {
  let component: OperationalTableComponent;
  let fixture: ComponentFixture<OperationalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationalTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
