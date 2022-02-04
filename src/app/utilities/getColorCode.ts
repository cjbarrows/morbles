import { ColorName } from '../ball';

export const getColorCode = (name: ColorName) => {
  switch (name) {
    case 'red':
      return 'R';
    case 'green':
      return 'G';
    case 'blue':
      return 'B';
    case 'purple':
      return 'P';
    default:
      return 'blue';
  }
};
