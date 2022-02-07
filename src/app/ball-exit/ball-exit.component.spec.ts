import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallExitComponent } from './ball-exit.component';

describe('BallExitComponent', () => {
  let component: BallExitComponent;
  let fixture: ComponentFixture<BallExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallExitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
