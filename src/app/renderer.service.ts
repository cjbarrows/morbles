import { Injectable } from '@angular/core';

import { GameBoard } from './gameboard';
import { DrawObject } from './drawobject';
import { PhysicsService } from './physics.service';

@Injectable({
  providedIn: 'root',
})
export class RendererService {
  private drawlist: Array<DrawObject> = [];

  constructor() {}

  clearDrawlist() {
    this.drawlist = [];
  }

  createDrawlistFromPhysics(physics: PhysicsService) {
    this.clearDrawlist();

    this.drawlist = [
      ...physics.getBumpers().map((bumper) => {
        return new DrawObject({ type: 'bumper', x: bumper.x, y: bumper.y });
      }),
      ...physics.getBalls().map((ball) => {
        return new DrawObject({ type: 'ball', x: ball.x, y: ball.y });
      }),
    ];
  }

  getDrawlist(): Array<DrawObject> {
    return this.drawlist;
  }

  getGameBoard(): GameBoard {
    return new GameBoard(this.drawlist);
  }
}
