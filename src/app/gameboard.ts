import { DrawObject } from './drawobject';
export class GameBoard {
  drawlist: Array<DrawObject>;

  constructor(newDrawlist: Array<DrawObject>) {
    this.drawlist = Array.from(newDrawlist);
  }

  getDrawlist() {
    return this.drawlist;
  }
}
