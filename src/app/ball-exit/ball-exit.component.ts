import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent,
} from '@angular/animations';

import { dropInTrigger } from './dropIn.trigger.animation';

@Component({
  selector: 'app-ball-exit',
  templateUrl: './ball-exit.component.html',
  styleUrls: ['./ball-exit.component.css'],
  animations: [dropInTrigger],
})
export class BallExitComponent implements OnInit {
  @Input() balls: string = '';

  isNewBall: boolean = false;
  currentStyles = {
    left: '75px',
  };

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('balls' in changes) {
      this.isNewBall = true;
    }
  }

  onAnimationEvent(event: AnimationEvent) {
    console.log(
      `${event.triggerName} and ${event.phaseName}: ${event.fromState} to ${event.toState}`
    );
  }

  setNewBall() {
    this.isNewBall = !this.isNewBall;
  }
}
