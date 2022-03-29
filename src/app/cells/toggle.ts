import { BallTracker } from './gamecell';
import { Air } from './air';
import { PhysicsService } from '../physics.service';
import Ball from '../ball';
import Point from '../point';
import { BALL_SPEED } from '../constants';

export class Toggle extends Air {
  flipped: boolean = false;

  constructor({ flipped }: { flipped?: boolean } = {}) {
    super();
    this.flipped = flipped ? true : false;
  }

  override addBall(
    physics: PhysicsService,
    ball: Ball,
    entryParams?: any
  ): BallTracker {
    const ballTracker = super.addBall(physics, ball, entryParams);
    /*
    if (entryParams && entryParams.proxy) {
      ball.x = entryParams && entryParams.x ? entryParams.x : 100;
      ball.y = entryParams && entryParams.y ? entryParams.y : 0;
      ballTracker.proxy = true;
    }
    */
    return ballTracker;
  }

  override tick(physics: PhysicsService) {
    this.balls.forEach((entry: BallTracker) => {
      entry.ticks += 1;

      const { ball, ticks, toCatcher } = entry;

      if (ticks === 1) {
        entry.toCatcher = this.inRightLane(ball) ? !this.flipped : this.flipped;
      }

      if (toCatcher) {
        if (ticks < 18) {
          ball.y = ticks * BALL_SPEED * 0.3;
          ball.x = this.inRightLane(ball)
            ? 100 - ticks * BALL_SPEED
            : ticks * BALL_SPEED;
        } else {
          ball.y += BALL_SPEED;
        }
        if (ticks === 19) {
          this.flipped = !this.flipped;
        }
      } else {
        if (ticks >= 7 && ticks <= 10) {
          ball.y = 7 * BALL_SPEED + (ticks - 7) * BALL_SPEED;
        } else {
          ball.y += BALL_SPEED;
        }

        if (ticks === 10) {
          this.flipped = !this.flipped;
        }
      }

      if (ball.y > 100) {
        physics.onBallExit(this, ball, { x: this.flipped ? 0 : 1, y: 1 });
      }
    });
  }

  getTogglePosition(): Point | null {
    return { x: 50, y: 50 };
  }

  onClick() {
    this.flipped = !this.flipped;
  }

  override getWidth() {
    return 2;
  }

  inRightLane(ball: Ball) {
    return false;
  }
}
