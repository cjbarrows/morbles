import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { dropOutTrigger } from './dropOut.trigger.animation';
import { getColorName } from '../utilities/getColorName';
import { ExitBallInfo } from '../exitBallInfo';
import { GAME_STATE } from '../constants';
import { PhysicsService } from '../physics.service';
import { ColorName } from '../ball';

interface BallInfo {
  chuteX: number;
  endX: number;
  color: ColorName;
}

@Component({
  selector: 'app-ball-exit',
  templateUrl: './ball-exit.component.html',
  styleUrls: ['./ball-exit.component.css'],
  animations: [dropOutTrigger],
})
export class BallExitComponent implements OnInit {
  @Input() width: number = 1600;
  @Input() exitBalls: Array<ExitBallInfo> = [];
  @Input() endingBalls: string = '';
  @Input() gameState: GAME_STATE = 'unstarted';

  ballInfo: Array<BallInfo> = [];

  chuteX: number = 0;
  endX: number = 0;

  completeBallCount: number = 0;

  constructor(private physics: PhysicsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if ('exitBalls' in changes) {
      this.refreshExitBallsForAnimation();
    }
  }

  refreshExitBallsForAnimation() {
    if (!this.exitBalls.length) {
      this.ballInfo = [];
      this.completeBallCount = 0;
    } else {
      const newBall: ExitBallInfo = this.exitBalls[this.exitBalls.length - 1];
      this.ballInfo.push({
        chuteX: newBall.x,
        endX: this.width - this.exitBalls.length * 60,
        color: getColorName(newBall.colorCode),
      });
    }
  }

  getBallClass(index: number) {
    return `ball ${this.ballInfo[index].color}`;
  }

  getTargetBallClass(index: number) {
    return this.completeBallCount > index
      ? 'ball complete'
      : `ball ${getColorName(this.endingBalls.split('')[index])}`;
  }

  getTargetBallStyle(index: number) {
    return {
      left: this.width - (index + 1) * 60 + 'px',
      opacity: 0.5,
    };
  }

  onAnimationEvent(index: number, event: any) {
    if (event.toState === 'new' && event.phaseName === 'done') {
      this.completeBallCount += 1;
      this.physics.ballDoneObservable.next([
        this.ballInfo[index].color,
        this.ballInfo[index].endX,
        true,
      ]);
    }
  }
}
