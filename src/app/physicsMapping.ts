import { GameCell } from './gamecell';
import { Air } from './air';
import { Bumper } from './bumper';

const mappings = [{ from: Bumper, to: Air, adjustment: { ticks: 7, y: 42 } }];

export const mapCells = (fromCell: GameCell, toCell: GameCell): any => {
  const findAdjustment = mappings.find(
    (mapping) =>
      fromCell instanceof mapping.from && toCell instanceof mapping.to
  );
  if (findAdjustment) {
    return findAdjustment.adjustment;
  }
  return undefined;
};
