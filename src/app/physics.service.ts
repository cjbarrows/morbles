import { Injectable } from '@angular/core';
import { System } from 'detect-collisions';
import { Response } from 'sat';

import { drag, gravity } from './constants';
import Ball from './ball';
import Bumper from './bumper';

@Injectable({
  providedIn: 'root',
})
export class PhysicsService {
  private balls: Array<Ball> = [];
  private bumpers: Array<Bumper> = [];

  private system: System;

  constructor() {
    this.system = new System();
  }

  clearAll() {
    this.balls = [];
  }

  addBumper(x: number, y: number) {
    const bumper = new Bumper(x, y);
    this.bumpers.push(bumper);

    const lineSegment = this.system.createPolygon({ x, y }, [
      { x: -10, y: -10 },
      { x: 10, y: 10 },
    ]);

    bumper.physicsObject = lineSegment;
  }

  launchBall(xPosition: number) {
    const ball = new Ball();
    ball.x = xPosition;
    this.balls.push(ball);

    const circle = this.system.createCircle({ x: ball.x, y: ball.y }, 10);

    ball.physicsObject = circle;
  }

  tick() {
    this.advancePhysics();
    this.cullPhysics();
    this.collisionDetectionAndResponse();
  }

  advancePhysics() {
    if (this.balls.length === 0) {
      return;
    }

    let ball: Ball;

    for (ball of this.balls) {
      ball.x += ball.velX;
      ball.y += ball.velY;

      ball.velY += gravity;

      ball.velX *= drag;

      if (ball.physicsObject) {
        ball.physicsObject.setPosition(ball.x, ball.y);
      }
    }
  }

  cullPhysics() {
    const toRemove = this.balls.filter((ball) => ball.y >= 500);

    toRemove.forEach((ball) => {
      if (ball.physicsObject) {
        this.system.remove(ball.physicsObject);
      }
    });

    this.balls = this.balls.filter((ball) => !toRemove.includes(ball));
  }

  getBalls(): Array<Ball> {
    return this.balls;
  }

  getBumpers(): Array<Bumper> {
    return this.bumpers;
  }

  collisionDetectionAndResponse() {
    this.system.update();

    this.system.checkAll((response) => this.handleCollisions(response));
  }

  handleCollisions(response: Response) {
    const ball = this.balls.find((ball) => ball.physicsObject === response.a);
    if (ball) {
      const bumper = this.bumpers.find(
        (bumper) => bumper.physicsObject === response.b
      );
      if (bumper) {
        console.log('bump');
        ball.velX = ball.velY * 0.4;
        ball.velY = -ball.velY * 0.6;
      }
    }
  }
}
