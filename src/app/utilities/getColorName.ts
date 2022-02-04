import { ColorName } from '../ball';

export const getColorName = (code: string): ColorName => {
  switch (code) {
    case 'R':
      return 'red';
    case 'G':
      return 'green';
    case 'B':
      return 'blue';
    case 'P':
      return 'purple';
    default:
      return 'blue';
  }
};
