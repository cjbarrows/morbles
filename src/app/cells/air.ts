import Ball from '../ball';
import { BallTracker, GameCell } from './gamecell';
import { PhysicsService } from '../physics.service';
import { BALL_SPEED, CELL_WIDTH } from '../constants';

export class Air extends GameCell {
  override addBall(
    physics: PhysicsService,
    ball: Ball,
    entryParams?: any
  ): BallTracker {
    const ballTracker = super.addBall(physics, ball, entryParams);
    ball.x = 0;
    ball.y = entryParams && entryParams.y ? entryParams.y : 0;
    return ballTracker;
  }

  override tick(physics: PhysicsService) {
    this.balls.forEach((bt: BallTracker) => {
      bt.ticks += 1;
      if (
        !physics.conditionalBallExit(this, bt.ticks, bt.ball, { x: -1, y: 0 })
      ) {
        bt.ball.y += BALL_SPEED;

        if (bt.ball.y > 100) {
          physics.onBallExit(this, bt.ball, { x: 0, y: 1 });
        }
      }
    });
  }

  override getBalls(): Array<Ball> {
    return this.balls.map(({ ball }) => ({
      x: ball.x + CELL_WIDTH * 0.5,
      y: ball.y,
      id: ball.id,
      color: ball.color,
    }));
  }
}
