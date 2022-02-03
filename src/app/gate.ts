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

const switchAnim = [
  [27, 30],
  [35, 27],
  [40, 25],
  [46, 25],
  [53, 25],
  [59, 25],
  [65, 27],
  [72, 30],
  [80, 26],
  [86, 24],
  [94, 25],
  [100, 32],
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
          } else if (ticks > 11 && ticks < 22) {
            ball.x = proxy
              ? 100 - switchAnim[ticks - 11][0]
              : switchAnim[ticks - 11][0];
            ball.y = switchAnim[ticks - 11][1];
          } else if (ticks >= 22) {
            ball.y += BALL_SPEED;
          }
        }

        if (ball.y > 100) {
          physics.onBallExit(this, ball, {
            x: ball.x < 100 && this.flipped ? 0 : 1,
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
