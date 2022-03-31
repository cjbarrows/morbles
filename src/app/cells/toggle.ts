import { BallTracker } from './gamecell';
import { Air } from './air';
import { PhysicsService } from '../physics.service';
import Ball from '../ball';
import Point from '../point';
import { BALL_SPEED } from '../constants';
import { findAnimation, AnimationFrame } from '../types/animations';

const startRolling = (
  _toggle: Toggle,
  ballEntry: BallTracker,
  _physics: PhysicsService
) => {
  ballEntry.ticks = 1;
  ballEntry.toCatcher = true;
  ballEntry.path = '';
};

const checkDirection = (
  toggle: Toggle,
  ballEntry: BallTracker,
  _physics: PhysicsService
) => {
  if (
    (!toggle.inRightLane(ballEntry.ball) && toggle.flipped) ||
    (toggle.inRightLane(ballEntry.ball) && !toggle.flipped)
  ) {
    ballEntry.toCatcher = true;
  } else {
    ballEntry.ticks = 3;
    ballEntry.ball.x = toggle.inRightLane(ballEntry.ball) ? 107 : 5;
    ballEntry.ball.y = 22;
    ballEntry.path = 'one-frame-hiccup';
  }
};

const nextAnim =
  ({ path, ticks }: { path: string; ticks: number }) =>
  (_toggle: Toggle, bt: BallTracker, _physics: PhysicsService) => {
    bt.path = path;
    bt.ticks = ticks;
  };

const animations: Array<AnimationFrame> = [
  ['bumper-to-toggle', 1, 0, 15, checkDirection],
  ['bumper-to-toggle', 2, 5, 2, startRolling],
  ['one-frame-hiccup', 4, -5, 28, nextAnim({ path: '', ticks: 4 })],
];

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
    return ballTracker;
  }

  override tick(physics: PhysicsService) {
    this.balls.forEach((entry: BallTracker) => {
      entry.ticks += 1;

      const { ball, ticks, path } = entry;

      const animation = findAnimation(animations, path || '', ticks);
      if (animation) {
        ball.x = this.inRightLane(ball)
          ? ((100 - animation[2]) as number)
          : (animation[2] as number);
        ball.y = animation[3] as number;

        const func = animation[4];

        if (func) {
          func(this, entry, physics);
        }
      } else {
        if (ticks === 1) {
          entry.toCatcher = this.inRightLane(ball)
            ? !this.flipped
            : this.flipped;
        }

        if (entry.toCatcher) {
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
          ball.x = this.inRightLane(ball) ? 100 : 0;
          if (ticks >= 7 && ticks <= 10) {
            ball.y = 7 * BALL_SPEED + (ticks - 7) * BALL_SPEED;
          } else {
            ball.y += BALL_SPEED;
          }

          if (ticks === 10) {
            this.flipped = !this.flipped;
          }
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
    return ball.cellX === this.cellX + 1;
  }
}
