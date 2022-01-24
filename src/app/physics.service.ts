import { Injectable } from '@angular/core';

import Point from './point';

import { gravity } from './constants';
import Ball from './ball';

@Injectable({
  providedIn: 'root',
})
export class PhysicsService {
  private balls: Array<Ball> = [];

  constructor() {
    const ball = new Ball();
    ball.x = 5;
    this.balls.push(ball);
  }

  tick() {
    let ball: Ball;

    for (ball of this.balls) {
      ball.x += ball.velX;
      ball.y += ball.velY;

      ball.velY += gravity;
    }
  }

  getBallPosition(): Point {
    const ball = this.balls[0];

    return { x: ball.x, y: ball.y };
  }
}
