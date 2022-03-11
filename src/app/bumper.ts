import { BallTracker } from './gamecell';
import { Air } from './air';
import { PhysicsService } from './physics.service';
import Point from './point';
import { BALL_SPEED } from './constants';

const curvePoints = [
  [0, 45],
  [10, 39],
  [21, 33],
  [31, 27],
  [41, 23],
  [50, 19],
  [59, 16],
  [67, 15],
  [74, 15],
  [81, 16],
  [87, 19],
  [91, 23],
  [95, 27],
  [98, 33],
  [99, 39],
  [100, 45],
];

export class Bumper extends Air {
  flipped: boolean = false;

  constructor({ flipped }: { flipped?: boolean } = {}) {
    super();
    this.flipped = flipped ? true : false;
  }

  override tick(physics: PhysicsService) {
    this.balls.forEach((entry: BallTracker) => {
      entry.ticks += 1;

      const { ball, ticks } = entry;

      if (
        !physics.conditionalBallExit(this, ticks, ball, {
          x: this.flipped ? -1 : 1,
          y: 0,
        })
      ) {
        if (ticks >= 7 && ticks <= 20) {
          // TODO: use tuple syntax?
          ball.x = curvePoints[ticks - 7][0] * (this.flipped ? -1 : 1);
          ball.y = curvePoints[ticks - 7][1];
        } else if (ticks < 7) {
          ball.y += BALL_SPEED;
        } else {
          ball.y += BALL_SPEED;
        }

        if (ball.y > 100) {
          physics.onBallExit(this, ball, { x: this.flipped ? -1 : 1, y: 1 });
        }
      }
    });
  }

  getBumperPosition(): Point | null {
    return { x: 50, y: 50 };
  }

  onClick() {
    this.flipped = !this.flipped;
  }
}
