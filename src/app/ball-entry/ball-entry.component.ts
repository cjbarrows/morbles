import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { dropInTrigger } from './dropIn.trigger.animation';
import { EntryBallInfo } from '../entryBallInfo';
import { getColorName } from '../utilities/getColorName';

@Component({
  selector: 'app-ball-entry',
  templateUrl: './ball-entry.component.html',
  styleUrls: ['./ball-entry.component.css'],
  animations: [dropInTrigger],
})
export class BallEntryComponent implements OnInit {
  @Input() entryBalls: string = '';
  @Output() notifyDoLaunch: EventEmitter<number> = new EventEmitter<number>();

  ballInfo: Array<EntryBallInfo> = [];

  currentChuteNumber: number = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('entryBalls' in changes) {
      this.refreshBallPositions();
    }
  }

  refreshBallPositions() {
    this.ballInfo = this.entryBalls.split('').map((colorCode, index) => {
      return {
        x: this.getBallStart(index),
        colorCode,
        moving: false,
        chuteX: 0,
      };
    });
  }

  getBallStart(index: number): number {
    return 1400 - (this.entryBalls.length - index) * 60;
  }

  getBallClass(index: number) {
    return `ball ${getColorName(this.ballInfo[index].colorCode)}`;
  }

  getBallStyle(index: number) {
    return {
      left: this.ballInfo[index].x + 'px',
    };
  }

  launchNextBall(chuteNumber: number) {
    this.currentChuteNumber = chuteNumber;
    this.ballInfo[0].moving = true;
    this.ballInfo[0].chuteX = chuteNumber * 100 + 50;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.toState === 'drop') {
      this.notifyDoLaunch.emit(this.currentChuteNumber);
    }
  }
}
