import { BallTracker } from './gamecell';
import { Air } from './air';
import Ball from '../ball';
import { PhysicsService } from '../physics.service';
import Point from '../point';
import { BALL_SPEED } from '../constants';

const catchAnim = [
  [5, 23],
  [9, 25],
  [14, 30],
  [19, 33],
  [24, 31],
  [27, 30],
];

const bumpAnim = [
  [27, 30],
  [21, 27],
  [16, 25],
  [10, 25],
  [5, 25],
];

const secondBallAnim = [
  [20, -12],
  [30, -15],
  [48, -12],
  [59, -8],
  [71, 3],
  [83, 12],
  [92, 20],
  [100, 28],
];

export class Gate extends Air {
  flipped: boolean = false;
  previousFlipped: boolean = false;

  constructor({ flipped }: { flipped?: boolean } = {}) {
    super();
    this.flipped = this.previousFlipped = flipped ? true : false;
  }

  override addBall(
    physics: PhysicsService,
    ball: Ball,
    entryParams?: any
  ): BallTracker {
    const ballTracker = super.addBall(physics, ball, entryParams);
    if (entryParams && entryParams.proxy) {
      ball.x = entryParams && entryParams.x ? entryParams.x : 100;
      ball.y = entryParams && entryParams.y ? entryParams.y : 0;
      ballTracker.proxy = true;
    }
    return ballTracker;
  }

  otherBallInCatcher(firstBall: Ball) {
    const otherBall = this.balls.find((entry: BallTracker) => {
      const { atRest, ball } = entry;
      return ball !== firstBall && atRest;
    });

    return otherBall;
  }

  headingToCatcher(ball: Ball) {
    return (ball.x < 100 && this.flipped) || (ball.x >= 100 && !this.flipped);
  }

  override tick(physics: PhysicsService) {
    let newFlip = this.flipped;

    this.balls.forEach((entry: BallTracker) => {
      const { ball, ticks, atRest, proxy } = entry;

      if (!atRest) {
        entry.ticks += 1;

        if (
          entry.ticks === 1 &&
          this.headingToCatcher(ball) &&
          this.otherBallInCatcher(ball)
        ) {
          entry.secondBall = true;
        }

        if (ticks === 4) {
          entry.toCatcher = this.headingToCatcher(ball);
        }

        if (entry.secondBall) {
          if (ticks < 8) {
            ball.x = proxy
              ? 100 - secondBallAnim[ticks][0]
              : secondBallAnim[ticks][0];
            ball.y = secondBallAnim[ticks][1];
          } else {
            ball.y += BALL_SPEED;
            if (ticks === 13) {
              newFlip = !this.flipped;
            }
          }
        } else if (!entry.toCatcher) {
          ball.y += BALL_SPEED;
          if (ticks === 9) {
            newFlip = !this.flipped;
          }
        } else {
          if (ticks < 10) {
            ball.x = proxy
              ? 100 - catchAnim[ticks - 4][0]
              : catchAnim[ticks - 4][0];
            ball.y = catchAnim[ticks - 4][1];
          } else if (ticks === 11) {
            entry.atRest = true;
          } else if (ticks > 11 && ticks < 16) {
            ball.x = proxy
              ? 100 - bumpAnim[ticks - 11][0]
              : bumpAnim[ticks - 11][0];
            ball.y = bumpAnim[ticks - 11][1];
          } else if (ticks >= 16) {
            ball.y += BALL_SPEED;
            if (ticks === 22) {
              newFlip = !this.flipped;
            }
          }
        }

        if (ball.y > 100) {
          physics.onBallExit(this, ball, {
            x: ball.x >= 90 ? 1 : 0,
            y: 1,
          });
        }
      } else {
        if (this.flipped !== this.previousFlipped) {
          entry.atRest = false;
        }
      }
    });

    this.previousFlipped = this.flipped;
    this.flipped = newFlip;
  }

  getGatePosition(): Point | null {
    return { x: 50, y: 50 };
  }

  onClick() {
    this.flipped = !this.flipped;
  }

  isFlipped() {
    return this.flipped;
  }
}
