import { GameCell } from './gamecell';
import { Air } from './air';
import { Bumper } from './bumper';
import { Gate } from './gate';
import { GateHandoff } from './gateHandoff';

export const getCellFromName = (name: string): GameCell => {
  let cell: GameCell;

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
    case 'gate-left':
      cell = new Gate({ flipped: true });
      break;
    case 'gate-right':
      cell = new Gate();
      break;
    case 'gate-handoff':
      cell = new GateHandoff();
      break;
    default:
      cell = new Air();
      break;
  }

  return cell;
};
