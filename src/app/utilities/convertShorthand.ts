import { ColorName } from '../ball';
import { CellContents } from '../types/cellContents';
import { getColorCode } from './getColorCode';

const getBallIfAny = (shorthand: string, index: number): ColorName | null => {
  if (index < shorthand.length - 1) {
    const code = shorthand[index + 1];
    switch (code) {
      case 'r':
        return 'red';
      case 'g':
        return 'green';
      case 'b':
        return 'blue';
      case 'p':
        return 'purple';
    }
  }
  return null;
};

export const convertShorthandMap = (shorthand: string): CellContents[] => {
  const cellContents = [];

  let index = 0;
  while (index < shorthand.length) {
    const letter = shorthand[index];

    let returnValue = { ball: getBallIfAny(shorthand, index), cell: 'air' };

    switch (letter) {
      case ' ':
        returnValue = { ...returnValue, cell: 'air' };
        break;
      case 'L':
        returnValue = { ...returnValue, cell: 'bumper-left' };
        break;
      case 'R':
        returnValue = { ...returnValue, cell: 'bumper-right' };
        break;
      case 'T':
        returnValue = { ...returnValue, cell: 'toggle-left' };
        break;
      case 'U':
        returnValue = { ...returnValue, cell: 'toggle-right' };
        break;
      case 'G':
        returnValue = { ...returnValue, cell: 'gate-left' };
        break;
      case 'H':
        returnValue = { ...returnValue, cell: 'gate-right' };
        break;
      case 'S':
        returnValue = { ...returnValue, cell: 'stopper' };
        break;
      default:
        returnValue = { ...returnValue, cell: 'air' };
        break;
    }

    cellContents.push(returnValue);
    index += returnValue.ball !== null ? 2 : 1;
  }

  return cellContents;
};

const getCodeForCellType = (cellName: string) => {
  switch (cellName) {
    case 'air':
      return ' ';
    case 'bumper-left':
      return 'L';
    case 'bumper-right':
      return 'R';
    case 'gate-left':
      return 'G';
    case 'gate-right':
      return 'H';
    case 'toggle-left':
      return 'T';
    case 'toggle-right':
      return 'U';
    case 'stopper':
      return 'S';
    default:
      return ' ';
  }
};

export const convertMapToShorthand = (
  cellNamesAndOptions: string[]
): string => {
  let shorthand = '';
  for (let i = 0; i < cellNamesAndOptions.length; i += 2) {
    const cellName = cellNamesAndOptions[i];
    const options = cellNamesAndOptions[i + 1];
    shorthand += getCodeForCellType(cellName);
    if (options) {
      shorthand += (getColorCode(options as ColorName) as string).toLowerCase();
    }
  }
  return shorthand;
};
