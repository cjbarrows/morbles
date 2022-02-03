import { Injectable } from '@angular/core';

import Ball from './ball';
import { GameCell } from './gamecell';
import { Bumper } from './bumper';
import { Gate } from './gate';
import Point from './point';
import { mapCells } from './physicsMapping';

interface GameCellEntry {
  id: number;
  x: number;
  y: number;
  cell: GameCell;
}

interface CellInfo extends Point {
  id: number;
  onClickHandler?: Function;
  flipped?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PhysicsService {
  private index = 0;
  private cells: Array<GameCellEntry> = [];

  numColumns: number = 8;
  numRows: number = 3;

  getNumColumns() {
    return this.numColumns;
  }

  setNumColumns(columns: number) {
    this.numColumns = columns;
    console.log(`physics now has ${this.numColumns} columns`);
  }

  get rows(): number {
    return this.numRows;
  }

  set rows(count: number) {
    this.numRows = count;
  }

  clearAll() {
    this.cells = [];
  }

  addCell(x: number, y: number, cell: GameCell) {
    cell.id = this.index;
    this.index += 1;
    this.cells.push({ x, y, cell, id: cell.id });
  }

  setCell(x: number, y: number, cell: GameCell) {
    const index = y * this.numColumns + x;
    const oldId = this.cells[index].id;
    this.cells[index] = { x, y, cell, id: oldId };
  }

  getGameCell(x: number, y: number): GameCellEntry | undefined {
    return this.cells.find((cell) => cell.x === x && cell.y === y);
  }

  findNextCell(cell: GameCell, offset: Point): GameCellEntry | undefined {
    const entry = this.cells.find((aCell) => aCell.cell === cell);
    if (entry) {
      const nextCell = this.getGameCell(entry.x + offset.x, entry.y + offset.y);
      return nextCell;
    }
    return undefined;
  }

  launchBall(xCell: number) {
    const ball = new Ball();
    ball.id = this.index;
    this.index += 1;

    const entry = this.getGameCell(xCell, 0);
    if (entry && entry.cell) {
      entry.cell.addBall(this, ball);
    }
  }

  tick() {
    this.advancePhysics();
    this.cullPhysics();
  }

  advancePhysics() {
    this.cells.forEach((entry) => {
      entry.cell.tick(this);
    });
  }

  cullPhysics() {}

  getBoundaries() {
    return this.cells.map((entry) => {
      return {
        id: entry.id,
        type: 'boundary',
        x: entry.x * 100,
        y: entry.y * 100,
        width: entry.cell.getWidth(),
        height: entry.cell.getHeight(),
      };
    });
  }

  getBalls(): Array<Ball> {
    const arrayOfBalls = this.cells.map(({ x, y, cell }) => {
      const cellBalls = cell.getBalls();
      return cellBalls.map((ball) => {
        return new Ball(x * 100 + ball.x, y * 100 + ball.y, ball.id);
      });
    });

    return arrayOfBalls.flat();
  }

  // TODO: rework this into something more TypeScript-y
  getBumpers(): Array<CellInfo> {
    let bumpers = [];
    for (let entry of this.cells) {
      if (entry.cell instanceof Bumper) {
        const bumper: Bumper = <Bumper>entry.cell;
        const pos = bumper.getBumperPosition();
        if (pos) {
          bumpers.push({
            id: entry.id,
            x: entry.x * 100 + pos.x,
            y: entry.y * 100 + pos.y,
            flipped: bumper.flipped,
            onClickHandler: () => bumper.onClick(),
          });
        }
      }
    }

    return bumpers;
  }

  // TODO: rework this into something more TypeScript-y
  getGates(): Array<CellInfo> {
    let gates = [];
    for (let entry of this.cells) {
      if (entry.cell instanceof Gate) {
        const gate: Gate = <Gate>entry.cell;
        const pos = gate.getGatePosition();
        if (pos) {
          gates.push({
            id: entry.id,
            x: entry.x * 100 + pos.x,
            y: entry.y * 100 + pos.y,
            flipped: gate.flipped,
            onClickHandler: () => gate.onClick(),
          });
        }
      }
    }

    return gates;
  }

  onBallExit(cell: GameCell, ball: Ball, exitPoint: Point) {
    cell.removeBall(ball);

    const nextCell: GameCellEntry | undefined = this.findNextCell(
      cell,
      exitPoint
    );
    if (nextCell) {
      nextCell.cell.addBall(this, ball);
    }
  }

  conditionalBallExit(cell: GameCell, ball: Ball, exitPoint: Point) {
    const nextCell: GameCellEntry | undefined = this.findNextCell(
      cell,
      exitPoint
    );
    if (nextCell) {
      const adjustment = mapCells(cell, nextCell.cell);
      cell.removeBall(ball);
      nextCell.cell.addBall(this, ball, adjustment);
      return true;
    }
    return false;
  }
}
