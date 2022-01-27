import Ball from './ball';
import { PhysicsService } from './physics.service';
import Point from './point';

export interface BallTracker {
  ball: Ball;
  ticks: number;
}

export class GameCell {
  id: number = 0;

  balls: Array<BallTracker> = [];

  addBall(ball: Ball, entryParams?: any) {
    this.balls.push({
      ball,
      ticks: entryParams && entryParams.ticks ? entryParams.ticks : 0,
    });
  }

  removeBall(ball: Ball) {
    this.balls = this.balls.filter((entry) => entry.ball !== ball);
  }

  getBalls() {
    return this.balls.map(({ ball }) => ball);
  }

  getBumperPosition(): Point | null {
    return null;
  }

  tick(physics: PhysicsService) {}

  getWidth() {
    return 100;
  }

  getHeight() {
    return 100;
  }
}
