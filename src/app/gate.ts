import { BallTracker } from './gamecell';
import { Air } from './air';
import Ball from './ball';
import { PhysicsService } from './physics.service';
import Point from './point';
import { BALL_SPEED } from './constants';

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
      ball.x = 100;
      ball.y = entryParams && entryParams.y ? entryParams.y : 0;
      ballTracker.proxy = true;
    }
    return ballTracker;
  }

  override tick(physics: PhysicsService) {
    let newFlip = this.flipped;

    this.balls.forEach((entry: BallTracker) => {
      const { ball, ticks, atrest, proxy } = entry;

      if (!atrest) {
        entry.ticks += 1;

        if (ticks === 4) {
          const toCatcher =
            (ball.x < 100 && this.flipped) || (ball.x >= 100 && !this.flipped);
          entry.toCatcher = toCatcher;
        }
        if (!entry.toCatcher) {
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
            entry.atrest = true;
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
            x: ball.x >= 100 || proxy ? 1 : 0,
            y: 1,
          });
        }
      } else {
        if (this.flipped !== this.previousFlipped) {
          entry.atrest = false;
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
}