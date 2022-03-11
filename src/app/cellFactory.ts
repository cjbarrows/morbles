import { GameCell } from './cells/gamecell';
import { Air } from './cells/air';
import { Bumper } from './cells/bumper';
import { Toggle } from './cells/toggle';
import { Gate } from './cells/gate';
import { GateHandoff } from './cells/gateHandoff';

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
    case 'gate-handoff':
      cell = new GateHandoff();
      break;
    default:
      cell = new Air();
      break;
  }

  return cell;
};
