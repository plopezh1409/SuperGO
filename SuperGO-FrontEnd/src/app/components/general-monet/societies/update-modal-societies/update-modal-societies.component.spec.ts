import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalSocietiesComponent } from './update-modal-societies.component';

describe('UpdateModalSocietiesComponent', () => {
  let component: UpdateModalSocietiesComponent;
  let fixture: ComponentFixture<UpdateModalSocietiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalSocietiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalSocietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
