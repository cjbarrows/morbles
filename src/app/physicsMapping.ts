import { GameCell } from './cells/gamecell';
import { PhysicsService } from './physics.service';
import { Gate } from './cells/gate';
import { Toggle } from './cells/toggle';

// NOTE: The order of these mappings is important
const mappings = [
  {
    from: 'Bumper',
    to: 'Gate',
    ticks: 18,
    adjustment: (
      _physics: PhysicsService,
      _fromCell: GameCell,
      _nextCell: GameCell
    ) => ({ ticks: 4 }),
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
    from: 'Bumper',
    to: 'Toggle',
    ticks: 18,
    adjustment: (
      _physics: PhysicsService,
      _fromCell: GameCell,
      _nextCell: GameCell
    ) => ({ ticks: 0, path: 'bumper-to-toggle' }),
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
