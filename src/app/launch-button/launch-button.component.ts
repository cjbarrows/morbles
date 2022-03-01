import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  AfterContentInit,
  Output,
} from '@angular/core';
import { flashAnimation } from 'angular-animations';

import { launchTrigger } from './launch.trigger.animation';
import { PhysicsService } from '../physics.service';

@Component({
  selector: 'app-launch-button',
  templateUrl: './launch-button.component.html',
  styleUrls: ['./launch-button.component.css'],
  animations: [flashAnimation(), launchTrigger],
})
export class LaunchButtonsComponent implements AfterContentInit {
  @Input() launchFunction: Function = () => {};
  @Input() index: number = 0;
  @Input() outOfBalls: boolean = false;
  @Output() notifyLaunchDone: EventEmitter<string> = new EventEmitter();

  animState: boolean = true;
  flaring: boolean = false;

  constructor(private elRef: ElementRef, private physics: PhysicsService) {}

  ngAfterContentInit(): void {
    this.elRef.nativeElement.style.setProperty('left', `${this.index * 100}px`);
  }

  doLaunchFunction() {
    if (this.launchFunction && !this.outOfBalls) {
      this.launchFunction(this.index);
      this.flaring = true;
    }
  }

  getAnimState() {
    if (this.outOfBalls) {
      return 'off';
    }

    return this.flaring ? 'flare' : this.animState ? 'off' : 'on';
  }

  animDone(event: any) {
    switch (event.toState) {
      case 'on':
      case 'off':
        this.animState = !this.animState;
        break;
      case 'flare':
      default:
        this.flaring = false;
        this.animState = true;
        this.notifyLaunchDone.emit('done');
        break;
    }
  }
}
