export interface GameLevel {
  id: number;
  name: string;
  hint: string;
  rows: number;
  columns: number;
  startingBalls: string;
  endingBalls: string;
  map: string;
}

export const BlankGameLevel = {
  id: -1,
  name: '',
  hint: '',
  startingBalls: '',
  endingBalls: '',
  rows: 3,
  columns: 3,
  map: '',
};
