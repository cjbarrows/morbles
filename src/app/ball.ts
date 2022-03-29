export type ColorName = 'blue' | 'green' | 'red' | 'purple';

export default class Ball {
  id?: number = 0;
  x: number = 0;
  y: number = 0;
  color?: ColorName = 'blue';
  cellX: number = 0;
  cellY: number = 0;

  constructor(x: number = 0, y: number = 0, id?: number, color?: ColorName) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.color = color;
  }
}
