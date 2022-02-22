export const convertShorthandMap = (shorthand: string): string[] => {
  return shorthand.split('').map((letter) => {
    switch (letter) {
      case ' ':
        return 'air';
      case 'L':
        return 'bumper-left';
      case 'R':
        return 'bumper-right';
      case 'G':
        return 'gate-left';
      case 'H':
        return 'gate-right';
      case 'O':
        return 'gate-handoff';
      default:
        return 'air';
    }
  });
};

export const convertMapToShorthand = (cellNames: string[]): string => {
  return cellNames
    .map((cellName) => {
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
        case 'gate-handoff':
          return 'O';
        default:
          return ' ';
      }
    })
    .join('');
};
