import { GameCell } from './cells/gamecell';
import { Air } from './cells/air';
import { Bumper } from './cells/bumper';
import { Toggle } from './cells/toggle';
import { Gate } from './cells/gate';
import { Stopper } from './cells/stopper';

export const makeCellFromName = (name: string): GameCell | null => {
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
    case 'stopper':
      cell = new Stopper();
      break;
    default:
      cell = null;
      break;
  }

  return cell;
};

export function getAllCellTypes(): Array<any> {
  return [
    { shorthand: ' ', code: 'air', label: 'Air', constructor: Air },
    {
      shorthand: 'L',
      code: 'bumper-left',
      label: 'Bumper Left',
      constructor: Bumper,
    },
    {
      shorthand: 'R',
      code: 'bumper-right',
      label: 'Bumper Right',
      constructor: Bumper,
    },
    {
      shorthand: 'T',
      code: 'toggle-left',
      label: 'Toggle Left',
      constructor: Toggle,
    },
    {
      shorthand: 'U',
      code: 'toggle-right',
      label: 'Toggle Right',
      constructor: Toggle,
    },
    {
      shorthand: 'G',
      code: 'gate-left',
      label: 'Gate Left',
      constructor: Gate,
    },
    {
      shorthand: 'H',
      code: 'gate-right',
      label: 'Gate Right',
      constructor: Gate,
    },
    { shorthand: 'S', code: 'stopper', label: 'Stopper', constructor: Stopper },
  ];
}
