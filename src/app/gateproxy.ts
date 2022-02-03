import Ball from './ball';
import { BallTracker, GameCell } from './gamecell';
import { PhysicsService } from './physics.service';

export class GateProxy extends GameCell {
  override addBall(
    physics: PhysicsService,
    ball: Ball,
    entryParams?: any
  ): BallTracker {
    const host = physics.findNextCell(this, { x: -1, y: 0 });

    if (host) {
      const ballTracker = host.cell.addBall(physics, ball, {
        ...entryParams,
        proxy: true,
        from: { x: 1, y: 0 },
      });
      return ballTracker;
    }

    return super.addBall(physics, ball, entryParams);
  }
}