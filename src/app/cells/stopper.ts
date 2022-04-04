import { BallTracker } from './gamecell';
import { Air } from './air';
import { PhysicsService } from '../physics.service';
import Point from '../point';
import { BALL_SPEED } from '../constants';

export class Stopper extends Air {
  override tick(physics: PhysicsService) {
    this.balls.forEach((entry: BallTracker) => {
      entry.ticks += 1;

      const { ball } = entry;

      if (ball.y < 96) {
        ball.y += BALL_SPEED;
      } else {
        physics.onBallExit(this, ball);
      }
    });
  }

  getImagePosition(): Point | null {
    return { x: 50, y: 50 };
  }
}
