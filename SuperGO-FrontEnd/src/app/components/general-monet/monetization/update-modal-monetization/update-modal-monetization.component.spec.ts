import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalMonetizationComponent } from './update-modal-monetization.component';

describe('UpdateModalMonetizationComponent', () => {
  let component: UpdateModalMonetizationComponent;
  let fixture: ComponentFixture<UpdateModalMonetizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalMonetizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalMonetizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
