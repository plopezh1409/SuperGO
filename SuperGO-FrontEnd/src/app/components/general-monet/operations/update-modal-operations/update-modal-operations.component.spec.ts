import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalOperationsComponent } from './update-modal-operations.component';

describe('UpdateModalOperationsComponent', () => {
  let component: UpdateModalOperationsComponent;
  let fixture: ComponentFixture<UpdateModalOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalOperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
