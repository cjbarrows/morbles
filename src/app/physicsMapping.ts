import { GameCell } from './gamecell';
import { Air } from './air';
import { Bumper } from './bumper';
import { GateHandoff } from './gateHandoff';
import { Gate } from './gate';
import { PhysicsService } from './physics.service';

// NOTE: The order of these mappings is important
const mappings = [
  {
    from: Bumper,
    to: GateHandoff,
    ticks: 21,
    adjustment: (physics: PhysicsService, nextCell: GameCell) => {
      const isFlipped = (nextCell as GateHandoff).isFlipped(physics);
      return isFlipped ? { ticks: 4, y: 40, x: 0 } : { ticks: 4, y: 30, x: 0 };
    },
  },
  {
    from: Bumper,
    to: Gate,
    ticks: 21,
    adjustment: (physics: PhysicsService, nextCell: GameCell) => {
      const isFlipped = (nextCell as GateHandoff).isFlipped(physics);
      return isFlipped ? { ticks: 4, y: 40, x: 0 } : { ticks: 4, y: 30, x: 0 };
    },
  },
  {
    from: Bumper,
    to: Air,
    ticks: 21,
    adjustment: () => ({
      ticks: 7,
      y: 40,
    }),
  },
];

export const mapCells = (
  physics: PhysicsService,
  ticks: number,
  fromCell: GameCell,
  toCell: GameCell
): any => {
  const findAdjustment = mappings.find(
    (mapping) =>
      mapping.ticks === ticks &&
      fromCell instanceof mapping.from &&
      toCell instanceof mapping.to
  );
  if (findAdjustment) {
    return findAdjustment.adjustment(physics, toCell);
  }
  return undefined;
};
