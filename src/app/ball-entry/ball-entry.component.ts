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
import { ChuteInfo } from '../chuteInfo';

@Component({
  selector: 'app-ball-entry',
  templateUrl: './ball-entry.component.html',
  styleUrls: ['./ball-entry.component.css'],
  animations: [dropInTrigger],
})
export class BallEntryComponent implements OnInit {
  @Input() entryBalls: Array<EntryBallInfo> = [];
  @Input() startingBalls: string = '';
  @Output() notifyDoLaunch: EventEmitter<ChuteInfo> =
    new EventEmitter<ChuteInfo>();

  chuteNumberQueue: Array<ChuteInfo> = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('entryBalls' in changes) {
      this.chuteNumberQueue = [];
    }
  }

  get currentBallIndex() {
    return this.startingBalls.length - this.entryBalls.length;
  }

  getBallClass(index: number) {
    return `ball ${getColorName(this.entryBalls[index].colorCode)}`;
  }

  getBallStyle(index: number) {
    return {
      left: this.entryBalls[index].x + 'px',
    };
  }

  launchNextBall(ballIndex: number, chuteNumber: number) {
    console.log(`setting ball ${ballIndex} to chute ${chuteNumber}`);

    console.log(`pushing ${chuteNumber}`);

    this.chuteNumberQueue.push({ chuteNumber, ballIndex });
    this.entryBalls[ballIndex].moving = true;
    this.entryBalls[ballIndex].chuteX = chuteNumber * 100 + 50;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.toState === 'drop') {
      console.log(this.chuteNumberQueue);
      const { chuteNumber, ballIndex } = this.chuteNumberQueue.shift() || {};
      this.notifyDoLaunch.emit({
        chuteNumber: chuteNumber || 0,
        ballIndex: ballIndex || 0,
      });
    }
  }
}
