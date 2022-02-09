import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallEntryComponent } from './ball-entry.component';

describe('BallEntryComponent', () => {
  let component: BallEntryComponent;
  let fixture: ComponentFixture<BallEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
