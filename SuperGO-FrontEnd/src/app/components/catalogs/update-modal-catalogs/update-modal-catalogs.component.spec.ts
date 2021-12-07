import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModalCatalogsComponent } from './update-modal-catalogs.component';

describe('UpdateModalCatalogsComponent', () => {
  let component: UpdateModalCatalogsComponent;
  let fixture: ComponentFixture<UpdateModalCatalogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalCatalogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModalCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
