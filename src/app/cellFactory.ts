import { GameCell } from './cells/gamecell';
import { Air } from './cells/air';
import { Bumper } from './cells/bumper';
import { Toggle } from './cells/toggle';
import { Gate } from './cells/gate';

export const getCellFromName = (name: string): GameCell | null => {
  let cell: GameCell | null;

  switch (name) {
    case 'air':
      cell = new Air();
      break;
    case 'bumper-left':
      cell = new Bumper({ flipped: true });
      break;
    case 'bumper-right':
      cell = new Bumper();
      break;
    case 'toggle-left':
      cell = new Toggle({ flipped: true });
      break;
    case 'toggle-right':
      cell = new Toggle();
      break;
    case 'gate-left':
      cell = new Gate({ flipped: true });
      break;
    case 'gate-right':
      cell = new Gate();
      break;
    default:
      cell = null;
      break;
  }

  return cell;
};
