export const convertShorthandMap = (shorthand: string): string[] => {
  return shorthand.split('').map((letter) => {
    switch (letter) {
      case 'A':
        return 'air';
      case 'L':
        return 'bumper-left';
      case 'R':
        return 'bumper-right';
      default:
        return 'air';
    }
  });
};
