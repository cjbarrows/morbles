import { GameLevel } from '../gameLevel';

const level: GameLevel = {
  id: 4,
  name: 'No Left Turn',
  hint: "If a ball goes out of bounds, it's lost forever.",
  rows: 2,
  columns: 2,
  startingBalls: 'RG',
  endingBalls: 'RG',
  map: '  ' + 'L ',
};

export default level;
