import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMonetizerComponent } from './home-monetizer.component';

describe('HomeMonetizerComponent', () => {
  let component: HomeMonetizerComponent;
  let fixture: ComponentFixture<HomeMonetizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeMonetizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMonetizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
