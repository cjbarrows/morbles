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
