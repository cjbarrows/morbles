import { Injectable } from '@angular/core';
import { GameBoard } from './gameboard';

import { PhysicsService } from './physics.service';

@Injectable({
  providedIn: 'root',
})
export class RendererService {
  private rows: Array<Array<string>> = [];

  constructor() {}

  clearRows() {
    this.rows = new Array<number>(this.numRows).fill(0).map((_) => {
      const cols = new Array<number>(this.numCols).fill(0);
      return cols.map((_) => {
        return '.';
      });
    });
  }

  drawFromPhysics(physics: PhysicsService) {
    this.clearRows();

    const ballPosition = physics.getBallPosition();

    this.setCell(ballPosition.y, ballPosition.x, 'O');
  }

  setCell(row: number, col: number, value: string) {
    const rowInt = Math.round(row),
      colInt = Math.round(col);

    if (
      rowInt >= 0 &&
      rowInt < this.rows.length &&
      colInt >= 0 &&
      colInt < this.rows[rowInt].length
    ) {
      this.rows[rowInt][colInt] = value;
    }
  }

  getCell(row: number, col: number): string {
    if (
      row >= 0 &&
      row < this.rows.length &&
      col >= 0 &&
      col < this.rows[row].length
    ) {
      return this.rows[row][col];
    }
    return '.';
  }

  getRows() {
    const rows = new Array<number>(this.numRows).fill(0);

    return rows.map((_, rowIndex: number) => {
      const cols = new Array<number>(this.numCols).fill(0);
      return cols.map((_, colIndex: number) => {
        return this.getCell(rowIndex, colIndex);
      });
    });
  }

  getGameBoard(): GameBoard {
    return new GameBoard(this.getRows());
  }

  get numRows(): number {
    return 20;
  }

  get numCols(): number {
    return 10;
  }
}
