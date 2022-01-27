export default class Ball {
  id?: number = 0;
  x: number = 0;
  y: number = 0;

  constructor(x: number = 0, y: number = 0, id?: number) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}
