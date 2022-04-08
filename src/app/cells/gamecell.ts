import Ball from '../ball';
import { PhysicsService } from '../physics.service';

export interface BallTracker {
  ball: Ball;
  ticks: number;
  atRest?: boolean;
  toCatcher?: boolean;
  secondBall?: boolean;
  path?: string;
  direction?: string;
}

export class GameCell {
  static inEditingMode: boolean = false;
  static onCellChange: Function;

  id: number = 0;

  cellX: number = 0;
  cellY: number = 0;

  balls: Array<BallTracker> = [];

  addBall(physics: PhysicsService, ball: Ball, entryParams?: any): BallTracker {
    const ballTracker: BallTracker = {
      ball,
      ticks: entryParams && entryParams.ticks ? entryParams.ticks : 0,
      atRest: false,
      path: entryParams && entryParams.path ? entryParams.path : '',
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
    return 1;
  }

  getHeight() {
    return 1;
  }

  serialize(): string {
    return '';
  }
}
