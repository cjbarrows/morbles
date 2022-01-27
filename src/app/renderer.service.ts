import { Injectable } from '@angular/core';

import { DrawObject } from './drawobject';
import { PhysicsService } from './physics.service';

@Injectable({
  providedIn: 'root',
})
export class RendererService {
  private drawlist: Array<DrawObject> = [];

  constructor() {}

  clearDrawlist() {
    this.drawlist.splice(0);
  }

  createDrawlistFromPhysics(physics: PhysicsService) {
    this.clearDrawlist();

    const newDrawList = [
      ...physics.getBoundaries().map((boundary) => {
        return new DrawObject({
          id: boundary.id,
          type: 'boundary',
          x: boundary.x,
          y: boundary.y,
          width: boundary.width,
          height: boundary.height,
        });
      }),
      ...physics.getBumpers().map((bumper) => {
        return new DrawObject({
          id: bumper.id,
          type: 'bumper',
          x: bumper.x,
          y: bumper.y,
          flipped: bumper.flipped,
          onClickHandler: () => {
            if (bumper.onClickHandler) {
              bumper.onClickHandler();
            }
          },
        });
      }),
      ...physics.getBalls().map((ball) => {
        return new DrawObject({
          id: ball && ball.id ? ball.id : 0,
          type: 'ball',
          x: ball.x,
          y: ball.y,
        });
      }),
    ];

    this.drawlist.push(...newDrawList);
  }

  getDrawlist(): Array<DrawObject> {
    return this.drawlist;
  }
}
