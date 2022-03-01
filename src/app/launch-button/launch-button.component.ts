import { Component, ElementRef, Input, AfterContentInit } from '@angular/core';
import { flashAnimation } from 'angular-animations';

import { flareTrigger } from './flare.trigger.animation';
import { PhysicsService } from '../physics.service';

@Component({
  selector: 'app-launch-button',
  templateUrl: './launch-button.component.html',
  styleUrls: ['./launch-button.component.css'],
  animations: [flashAnimation(), flareTrigger],
})
export class LaunchButtonsComponent implements AfterContentInit {
  @Input() launchFunction: Function = () => {};
  @Input() index: number = 0;

  animState: boolean = true;
  first: boolean = true;
  flaring: boolean = false;

  constructor(private elRef: ElementRef, private physics: PhysicsService) {}

  ngAfterContentInit(): void {
    this.elRef.nativeElement.style.setProperty('left', `${this.index * 100}px`);
  }

  doLaunchFunction() {
    if (this.launchFunction) {
      this.launchFunction(this.index);
      this.flaring = true;
    }
  }

  getDelayValue() {
    const delay = this.first
      ? ((this.index + 1) / (this.physics.numColumns + 1)) * 1000
      : 0;
    return delay;
  }

  animDone(event: any) {
    this.animState = !this.animState;
    if (event.fromState !== 'void') {
      this.first = false;
    }
  }

  flareDone(event: any) {
    console.log('done flaring');
    console.log(event);
    if (event.toState === 'flare') {
      this.flaring = false;
    }
  }
}
