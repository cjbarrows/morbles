import { GameCell } from './cells/gamecell';
import { PhysicsService } from './physics.service';
import { Gate } from './cells/gate';
import { from } from 'rxjs';

// NOTE: The order of these mappings is important
const mappings = [
  {
    from: 'Bumper',
    to: 'Gate',
    ticks: 21,
    adjustment: (
      _physics: PhysicsService,
      _fromCell: GameCell,
      nextCell: GameCell
    ) => {
      const isFlipped = (nextCell as Gate).isFlipped();
      return isFlipped ? { ticks: 4 } : { ticks: 5 };
    },
  },
  {
    from: 'Bumper',
    to: 'Air',
    ticks: 21,
    adjustment: (
      _physics: PhysicsService,
      _fromCell: GameCell,
      _nextCell: GameCell
    ) => ({
      ticks: 7,
      y: 40,
    }),
  },
  {
    from: 'Air',
    to: 'Gate',
    ticks: 1,
    adjustment: (
      _physics: PhysicsService,
      _fromCell: GameCell,
      _nextCell: GameCell
    ) => ({
      path: 'fall',
      direction: 'top',
    }),
  },
  {
    from: 'Air',
    to: 'Gate',
    ticks: 8,
    adjustment: (
      _physics: PhysicsService,
      _fromCell: GameCell,
      _nextCell: GameCell
    ) => ({
      path: 'catch',
      ticks: 0,
      y: 40,
    }),
  },
  {
    from: 'Air',
    to: 'Toggle',
    ticks: 1,
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
  if (findAdjustment && findAdjustment.adjustment) {
    return findAdjustment.adjustment(physics, fromCell, toCell);
  }
  return undefined;
};
