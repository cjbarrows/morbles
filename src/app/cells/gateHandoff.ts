import Ball from '../ball';
import { BallTracker, GameCell } from './gamecell';
import { PhysicsService } from '../physics.service';
import { Gate } from './gate';

export class GateHandoff extends GameCell {
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

  isFlipped(physics: PhysicsService) {
    const host = physics.findNextCell(this, { x: -1, y: 0 });
    if (host && host.cell instanceof Gate) {
      return host.cell.flipped;
    }
    return false;
  }
}
