import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMonetizationComponent } from './table-monetization.component';

describe('TableMonetizationComponent', () => {
  let component: TableMonetizationComponent;
  let fixture: ComponentFixture<TableMonetizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableMonetizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMonetizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
