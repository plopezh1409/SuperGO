import { ComponentFixture, TestBed } from '@angular/core/testing';

import { societiescomponent } from './societies.component';

describe('societiesComponent', () => {
  let component: societiescomponent;
  let fixture: ComponentFixture<societiescomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ societiescomponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(societiescomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
