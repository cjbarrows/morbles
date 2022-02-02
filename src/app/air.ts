import Ball from './ball';
import { BallTracker, GameCell } from './gamecell';
import { PhysicsService } from './physics.service';
import { BALL_SPEED } from './constants';

export class Air extends GameCell {
  override addBall(ball: Ball, entryParams?: any) {
    super.addBall(ball, entryParams);
    ball.x = 0;
    ball.y = entryParams && entryParams.y ? entryParams.y : 0;
  }

  override tick(physics: PhysicsService) {
    this.balls.forEach(({ ball, ticks }: BallTracker) => {
      ball.y += BALL_SPEED;
      ticks += 1;

      if (ball.y > 100) {
        physics.onBallExit(this, ball, { x: 0, y: 1 });
      }
    });
  }

  override getBalls(): Array<Ball> {
    return this.balls.map(({ ball }) => ({
      x: ball.x + 50,
      y: ball.y,
      id: ball.id,
    }));
  }
}
