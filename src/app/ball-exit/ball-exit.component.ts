import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { dropOutTrigger } from './dropOut.trigger.animation';
import { getColorName } from '../utilities/getColorName';
import { ExitBallInfo } from '../exitBallInfo';

interface BallInfo {
  chuteX: number;
  endX: number;
  color: string;
}

@Component({
  selector: 'app-ball-exit',
  templateUrl: './ball-exit.component.html',
  styleUrls: ['./ball-exit.component.css'],
  animations: [dropOutTrigger],
})
export class BallExitComponent implements OnInit {
  @Input() exitBalls: Array<ExitBallInfo> = [];

  ballInfo: Array<BallInfo> = [];

  chuteX: number = 0;
  endX: number = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('exitBalls' in changes) {
      this.refreshExitBallsForAnimation();
    }
  }

  refreshExitBallsForAnimation() {
    if (!this.exitBalls.length) {
      this.ballInfo = [];
    } else {
      const newBall: ExitBallInfo = this.exitBalls[this.exitBalls.length - 1];
      this.ballInfo.push({
        chuteX: newBall.x,
        endX: 1600 - this.exitBalls.length * 60,
        color: getColorName(newBall.colorCode),
      });
    }
  }

  getBallClass(index: number) {
    return `ball ${this.ballInfo[index].color}`;
  }
}
