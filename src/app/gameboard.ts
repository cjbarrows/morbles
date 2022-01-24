export class GameBoard {
  rows: Array<Array<string>>;

  constructor(newRows: Array<Array<string>>) {
    this.rows = Array.from(newRows);
  }
}
