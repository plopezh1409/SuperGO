import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalAccountingComponent } from './update-modal-accounting.component';

describe('UpdateModalAccountingComponent', () => {
  let component: UpdateModalAccountingComponent;
  let fixture: ComponentFixture<UpdateModalAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
