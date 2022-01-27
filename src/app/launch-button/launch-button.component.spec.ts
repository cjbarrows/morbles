import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchButtonsComponent } from './launch-button.component';

describe('LaunchButtonsComponent', () => {
  let component: LaunchButtonsComponent;
  let fixture: ComponentFixture<LaunchButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaunchButtonsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
