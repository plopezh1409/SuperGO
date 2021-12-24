import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBillsComponent } from './table-bills.component';

describe('TableBillsComponent', () => {
  let component: TableBillsComponent;
  let fixture: ComponentFixture<TableBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
