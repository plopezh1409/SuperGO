import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalOperationComponent } from './update-modal-operation.component';

describe('UpdateModalOperationComponent', () => {
  let component: UpdateModalOperationComponent;
  let fixture: ComponentFixture<UpdateModalOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
