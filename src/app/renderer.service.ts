import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { DrawObject } from './drawobject';
import { PhysicsService } from './physics.service';

@Injectable({
  providedIn: 'root',
})
export class RendererService {
  private drawList$: Subject<Array<DrawObject>>;

  constructor() {
    this.drawList$ = new Subject<Array<DrawObject>>();
  }

  forceRedraw(physics: PhysicsService) {
    this.createDrawlistFromPhysics(physics);
  }

  createDrawlistFromPhysics(physics: PhysicsService) {
    const newDrawlist = [
      ...physics.getBoundaries().map((boundary) => {
        return new DrawObject({
          id: boundary.id,
          type: 'boundary',
          x: boundary.x,
          y: boundary.y + 30,
          width: boundary.width,
          height: boundary.height * 0.8,
        });
      }),
      ...physics.getStoppers().map((stopper) => {
        return new DrawObject({
          id: stopper.id,
          type: 'stopper',
          x: stopper.x,
          y: stopper.y,
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
      ...physics.getToggles().map((toggle) => {
        return new DrawObject({
          id: toggle.id,
          type: 'toggle',
          x: toggle.x,
          y: toggle.y,
          flipped: toggle.flipped,
          onClickHandler: () => {
            if (toggle.onClickHandler) {
              toggle.onClickHandler();
            }
          },
        });
      }),
      ...physics.getGates().map((gate) => {
        return new DrawObject({
          id: gate.id,
          type: 'gate',
          x: gate.x,
          y: gate.y,
          flipped: gate.flipped,
          onClickHandler: () => {
            if (gate.onClickHandler) {
              gate.onClickHandler();
            }
          },
        });
      }),
      ...physics.getBalls().map((ball) => {
        return new DrawObject({
          id: ball && ball.id ? ball.id : 0,
          type: 'ball',
          color: ball.color,
          x: ball.x,
          y: ball.y,
        });
      }),
      ...physics.getStoppers().map((stopper) => {
        return new DrawObject({
          id: stopper.id,
          type: 'stopper-foreground',
          x: stopper.x,
          y: stopper.y,
        });
      }),
    ];

    this.drawList$.next(newDrawlist);
  }

  getDrawlistObservable(): Subject<Array<DrawObject>> {
    return this.drawList$;
  }
}
