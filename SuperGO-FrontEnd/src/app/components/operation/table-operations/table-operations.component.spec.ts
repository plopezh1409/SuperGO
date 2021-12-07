import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOperationsComponent } from './table-operations.component';

describe('TableOperationsComponent', () => {
  let component: TableOperationsComponent;
  let fixture: ComponentFixture<TableOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableOperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
