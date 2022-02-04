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
      case 'F':
        return 'gate-handoff';
      default:
        return 'air';
    }
  });
};
