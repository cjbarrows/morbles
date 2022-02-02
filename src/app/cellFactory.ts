import { GameCell } from './gamecell';
import { Air } from './air';
import { Bumper } from './bumper';

export const getCellFromName = (name: string): GameCell => {
  let cell: GameCell;

  switch (name) {
    case 'air':
      cell = new Air();
      break;
    case 'bumper-left':
      cell = new Bumper();
      (cell as Bumper).flipped = true;
      break;
    case 'bumper-right':
      cell = new Bumper();
      break;
    default:
      cell = new Air();
      break;
  }

  return cell;
};
