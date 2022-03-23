import { GameCell } from './cells/gamecell';
import { PhysicsService } from './physics.service';
import { Gate } from './cells/gate';

// NOTE: The order of these mappings is important
const mappings = [
  {
    from: 'Bumper',
    to: 'Gate',
    ticks: 21,
    adjustment: (physics: PhysicsService, nextCell: GameCell) => {
      const isFlipped = (nextCell as Gate).isFlipped();
      return isFlipped ? { ticks: 4, y: 40, x: 0 } : { ticks: 4, y: 30, x: 0 };
    },
  },
  {
    from: 'Bumper',
    to: 'Air',
    ticks: 21,
    adjustment: (_physics: PhysicsService, _nextCell: GameCell) => ({
      ticks: 7,
      y: 40,
    }),
  },
  {
    from: 'Air',
    to: 'Gate',
    ticks: 1,
    adjustment: (_physics: PhysicsService, _nextCell: GameCell) => ({
      proxy: true,
      animation: 'entry',
      direction: 'top',
    }),
  },
  {
    from: 'Air',
    to: 'Gate',
    ticks: 8,
    adjustment: (_physics: PhysicsService, _nextCell: GameCell) => ({
      proxy: true,
      ticks: 0,
      y: 40,
    }),
  },
  {
    from: 'Air',
    to: 'Toggle',
    ticks: 1,
    adjustment: () => ({ proxy: true }),
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
      fromCell.constructor.name === mapping.from &&
      toCell.constructor.name === mapping.to
  );
  if (findAdjustment) {
    return findAdjustment.adjustment(physics, toCell);
  }
  return undefined;
};
