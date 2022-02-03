import Ball from './ball';
import { PhysicsService } from './physics.service';

export interface BallTracker {
  ball: Ball;
  ticks: number;
  atrest?: boolean;
  proxy?: boolean;
  toCatcher?: boolean;
}

export class GameCell {
  id: number = 0;

  balls: Array<BallTracker> = [];

  addBall(physics: PhysicsService, ball: Ball, entryParams?: any): BallTracker {
    const ballTracker: BallTracker = {
      ball,
      ticks: entryParams && entryParams.ticks ? entryParams.ticks : 0,
      atrest: false,
      proxy: false,
    };
    this.balls.push(ballTracker);
    return ballTracker;
  }

  removeBall(ball: Ball) {
    this.balls = this.balls.filter((entry) => entry.ball !== ball);
  }

  getBalls() {
    return this.balls.map(({ ball }) => ball);
  }

  tick(physics: PhysicsService) {}

  getWidth() {
    return 100;
  }

  getHeight() {
    return 100;
  }
}
