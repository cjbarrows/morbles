import { BallTracker, GameCell } from './gamecell';
import { Air } from './air';
import Ball from '../ball';
import { PhysicsService } from '../physics.service';
import Point from '../point';
import { findAnimation, AnimationFrame } from '../types/animations';

const atRest = (_gate: Gate, bt: BallTracker) => {
  bt.atRest = true;
};

const couldKnockOut = (gate: Gate, bt: BallTracker) => {
  const otherBall = gate.otherBallInCatcher(bt.ball);
  if (
    otherBall &&
    ((!gate.inRightLane(bt.ball) && gate.isFlipped()) ||
      (gate.inRightLane(bt.ball) && !gate.isFlipped()))
  ) {
    otherBall.path = 'knockedOut';
    otherBall.ticks = 1;
    otherBall.atRest = false;
    return { path: 'catch' };
  }
  return null;
};

const couldCatch = (gate: Gate, bt: BallTracker) => {
  if (
    (!gate.inRightLane(bt.ball) && gate.isFlipped()) ||
    (gate.inRightLane(bt.ball) && !gate.isFlipped())
  ) {
    if (gate.otherBallInCatcher(bt.ball)) {
      return { path: 'bounceOver' };
    } else {
      return { path: 'catch' };
    }
  }
  return null;
};

const couldBounceOver = (gate: Gate, bt: BallTracker) => {
  if (
    (!gate.inRightLane(bt.ball) && gate.isFlipped()) ||
    (gate.inRightLane(bt.ball) && !gate.isFlipped())
  ) {
    if (gate.otherBallInCatcher(bt.ball)) {
      return { path: 'bounceOver' };
    }
  }
  return null;
};

const couldFlipGate = (gate: Gate, bt: BallTracker) => {
  if (
    (!gate.inRightLane(bt.ball) && !gate.isFlipped()) ||
    (gate.inRightLane(bt.ball) && gate.isFlipped())
  ) {
    return { flip: true };
  }
  return null;
};

const couldExit = (gate: Gate, bt: BallTracker, physics: PhysicsService) => {
  gate.doExit(bt, physics);
};

const nextAnim =
  ({
    path,
    ticks,
    flipLanes,
  }: {
    path: string;
    ticks: number;
    flipLanes?: boolean;
  }) =>
  (gate: Gate, bt: BallTracker, _physics: PhysicsService) => {
    bt.path = path;
    bt.ticks = ticks;
    if (flipLanes) {
      bt.ball.cellX = gate.inRightLane(bt.ball) ? gate.cellX : gate.cellX + 1;
    }
  };

const animations: Array<AnimationFrame> = [
  ['fall', 0, 0, 0, couldBounceOver],
  ['fall', 1, 0, 6],
  ['fall', 2, 0, 12],
  ['fall', 3, 0, 18],
  ['fall', 4, 0, 24, couldKnockOut],
  ['fall', 5, 0, 30, couldCatch],
  ['fall', 6, 0, 36],
  ['fall', 7, 0, 42],
  ['fall', 8, 0, 48],
  ['fall', 9, 0, 54],
  ['fall', 10, 0, 60],
  ['fall', 11, 0, 66, couldFlipGate],
  ['fall', 12, 0, 70],
  ['fall', 13, 0, 76],
  ['fall', 14, 0, 82],
  ['fall', 15, 0, 88],
  ['fall', 16, 0, 94],
  ['fall', 17, 0, 100],
  ['fall', 18, 0, 106, couldExit],
  ['catch', 0, 5, 23],
  ['catch', 1, 9, 25],
  ['catch', 2, 14, 30],
  ['catch', 3, 19, 33],
  ['catch', 4, 24, 31],
  ['catch', 5, 27, 30, atRest],
  ['catch', 6, 24, 28],
  ['catch', 7, 20, 25],
  ['catch', 8, 15, 30, nextAnim({ path: 'fall', ticks: 6 })],
  ['bounceOver', 1, 20, -12],
  ['bounceOver', 2, 30, -15],
  ['bounceOver', 3, 48, -12],
  ['bounceOver', 4, 59, -8],
  ['bounceOver', 5, 71, 3],
  ['bounceOver', 6, 83, 12],
  ['bounceOver', 7, 92, 20],
  [
    'bounceOver',
    8,
    100,
    28,
    nextAnim({ path: 'fall', ticks: 6, flipLanes: true }),
  ],
  ['knockedOut', 1, 40, 20],
  ['knockedOut', 2, 50, 20],
  ['knockedOut', 3, 60, 21],
  ['knockedOut', 4, 70, 22],
  ['knockedOut', 5, 80, 24],
  ['knockedOut', 6, 90, 26],
  [
    'knockedOut',
    7,
    100,
    28,
    nextAnim({ path: 'fall', ticks: 6, flipLanes: true }),
  ],
];

export class Gate extends Air {
  flipped: boolean = false;
  previousFlipped: boolean = false;

  constructor({ flipped }: { flipped?: boolean } = {}) {
    super();
    this.flipped = this.previousFlipped = flipped ? true : false;
  }

  override addBall(
    physics: PhysicsService,
    ball: Ball,
    entryParams?: any
  ): BallTracker {
    if (entryParams && entryParams.duringSetup) {
      entryParams = {
        ...entryParams,
        path: 'catch',
        ticks: 5,
        atRest: true,
      };
      ball.cellX = this.cellX + (this.flipped ? 0 : 1);
    }

    const ballTracker = super.addBall(physics, ball, {
      path: 'fall',
      ...entryParams,
    });
    return ballTracker;
  }

  otherBallInCatcher(firstBall: Ball) {
    const otherBall = this.balls.find((entry: BallTracker) => {
      const { atRest, ball } = entry;
      return ball !== firstBall && atRest;
    });

    return otherBall;
  }

  override tick(physics: PhysicsService) {
    let newFlip = this.flipped;

    this.balls.forEach((entry: BallTracker) => {
      const { ball, ticks, path, atRest } = entry;

      if (!atRest) {
        const animation = findAnimation(animations, path || '', ticks);
        if (animation) {
          ball.x = this.inRightLane(ball)
            ? ((100 - animation[2]) as number)
            : (animation[2] as number);
          ball.y = animation[3] as number;

          const func = animation[4];

          if (func) {
            const result = func(this, entry, physics);
            if (result) {
              if (result.flip) {
                newFlip = !this.flipped;
              } else if (result.path) {
                entry.path = result.path;
                entry.ticks = 0;
              }
            }
          }
        }
        entry.ticks += 1;
      } else {
        if (this.flipped !== this.previousFlipped) {
          entry.atRest = false;
        }
      }
    });

    this.previousFlipped = this.flipped;
    this.flipped = newFlip;
  }

  doExit(bt: BallTracker, physics: PhysicsService) {
    physics.onBallExit(this, bt.ball, {
      x: this.inRightLane(bt.ball) ? 1 : 0,
      y: 1,
    });
  }

  getGatePosition(): Point | null {
    return { x: 50, y: 50 };
  }

  onClick() {
    if (GameCell.inEditingMode) {
      this.flipped = !this.flipped;
      GameCell.onCellChange(this);
    }
  }

  isFlipped() {
    return this.flipped;
  }

  override getWidth() {
    return 2;
  }

  inRightLane(ball: Ball) {
    return ball.cellX === this.cellX + 1;
  }

  override serialize(): string {
    return `gate-${this.flipped ? 'left' : 'right'}`;
  }

  override canPreloadBall(): boolean {
    return true;
  }
}
