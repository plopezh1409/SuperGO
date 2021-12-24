import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAccountingComponent } from './table-accounting.component';

describe('TableAccountingComponent', () => {
  let component: TableAccountingComponent;
  let fixture: ComponentFixture<TableAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
