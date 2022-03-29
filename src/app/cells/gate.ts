import { BallTracker } from './gamecell';
import { Air } from './air';
import Ball from '../ball';
import { PhysicsService } from '../physics.service';
import Point from '../point';

type AnimationFrame = [
  path: string,
  ticks: number,
  x: number,
  y: number,
  condition?: Function
];

const atRest = (gate: Gate, bt: BallTracker) => {
  bt.atRest = true;
};

const couldCatch = (gate: Gate, bt: BallTracker) => {
  if ((!bt.proxy && gate.isFlipped()) || (bt.proxy && !gate.isFlipped())) {
    if (gate.otherBallInCatcher(bt.ball)) {
      return { path: 'bounceOver' };
    } else {
      return { path: 'catch' };
    }
  }
  return null;
};

const couldBounceOver = (gate: Gate, bt: BallTracker) => {
  if ((!bt.proxy && gate.isFlipped()) || (bt.proxy && !gate.isFlipped())) {
    if (gate.otherBallInCatcher(bt.ball)) {
      return { path: 'bounceOver' };
    }
  }
  return null;
};

const couldFlipGate = (gate: Gate, bt: BallTracker) => {
  if ((!bt.proxy && !gate.isFlipped()) || (bt.proxy && gate.isFlipped())) {
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
    proxyFlip,
  }: {
    path: string;
    ticks: number;
    proxyFlip?: boolean;
  }) =>
  (gate: Gate, bt: BallTracker, physics: PhysicsService) => {
    // const = params;
    bt.path = path;
    bt.ticks = ticks;
    if (proxyFlip !== undefined) {
      bt.proxy = !bt.proxy;
    }
  };

const animations: Array<AnimationFrame> = [
  ['fall', 0, 0, 0, couldBounceOver],
  ['fall', 1, 0, 6],
  ['fall', 2, 0, 12],
  ['fall', 3, 0, 18],
  ['fall', 4, 0, 24],
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
    nextAnim({ path: 'fall', ticks: 6, proxyFlip: true }),
  ],
];

// entry => falls toward gate
// sit in gate
// pass through and flip gate
// bounce off top of other ball and flip gate
// knock other ball out and sit in gate

const findAnimation = (path: string, ticks: number) => {
  return animations.find(
    (animation) => animation[0] === path && animation[1] === ticks
  );
};
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
    const ballTracker = super.addBall(physics, ball, {
      path: 'fall',
      ...entryParams,
    });
    if (entryParams && entryParams.proxy) {
      ballTracker.ticks =
        entryParams && entryParams.ticks ? entryParams.ticks : 0;
      ballTracker.proxy = true;
    }
    return ballTracker;
  }

  otherBallInCatcher(firstBall: Ball) {
    const otherBall = this.balls.find((entry: BallTracker) => {
      const { atRest, ball } = entry;
      return ball !== firstBall && atRest;
    });

    return otherBall;
  }

  headingToCatcher(ball: Ball) {
    return (ball.x < 100 && this.flipped) || (ball.x >= 100 && !this.flipped);
  }

  override tick(physics: PhysicsService) {
    let newFlip = this.flipped;

    this.balls.forEach((entry: BallTracker) => {
      const { ball, ticks, path, atRest, proxy } = entry;

      if (!atRest) {
        const animation = findAnimation(path || '', ticks);
        if (animation) {
          ball.x = proxy
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
      x: bt.proxy ? 1 : 0,
      y: 1,
    });
  }

  getGatePosition(): Point | null {
    return { x: 50, y: 50 };
  }

  onClick() {
    this.flipped = !this.flipped;
  }

  isFlipped() {
    return this.flipped;
  }
}
