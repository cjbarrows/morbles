import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import Ball, { ColorName } from './ball';
import { GameCell } from './cells/gamecell';
import { Bumper } from './cells/bumper';
import { Gate } from './cells/gate';
import { Toggle } from './cells/toggle';
import { Stopper } from './cells/stopper';
import Point from './point';
import { mapCells } from './physicsMapping';
import { CELL_WIDTH } from './constants';
import { makeCellFromName } from './cellFactory';
import { CellContents } from './types/cellContents';

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
  cellY?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PhysicsService {
  private index = 0;
  private cells: Array<GameCellEntry> = [];

  numColumns: number = 8;
  numRows: number = 3;

  ballExitObservable: Subject<[ColorName, number, boolean]> = new Subject<
    [ColorName, number, boolean]
  >();

  ballDoneObservable: Subject<[ColorName, number, boolean]> = new Subject<
    [ColorName, number, boolean]
  >();

  getNumColumns() {
    return this.numColumns;
  }

  setNumColumns(columns: number) {
    this.numColumns = columns;
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
    cell.cellX = x;
    cell.cellY = y;
    this.cells.push({ x, y, cell, id: cell.id });
  }

  setCell(x: number, y: number, cell: GameCell) {
    const index = y * this.numColumns + x;
    const oldId = this.cells[index].id;
    this.cells[index] = { x, y, cell, id: oldId };
  }

  getGameCell(x: number, y: number): GameCellEntry | undefined {
    return this.cells.find(
      (cell) =>
        (cell.x === x && cell.y === y) ||
        (cell.x + (cell.cell.getWidth() - 1) === x && cell.y === y)
    );
  }

  getCellPosition(cell: GameCell): { x: number; y: number } | undefined {
    const entry = this.cells.find((aCell) => aCell.cell === cell);
    if (entry) {
      return { x: entry.x, y: entry.y };
    }
    return undefined;
  }

  getColumnIndexForCell(cell: GameCell) {
    const colIndex = this.cells.reduce(
      (accum: number, gameCell: GameCellEntry) => {
        return gameCell.y === cell.cellY && gameCell.x < cell.cellX
          ? accum + 1
          : accum;
      },
      0
    );
    return colIndex;
  }

  findNextCell(cell: GameCell, offset?: Point): GameCellEntry | undefined {
    const entry = this.cells.find((aCell) => aCell.cell === cell);
    if (entry && offset) {
      const nextCell = this.getGameCell(entry.x + offset.x, entry.y + offset.y);
      return nextCell;
    }
    return undefined;
  }

  populateCellsFromMap(mapCells: Array<CellContents>) {
    this.clearAll();

    let rowIndex: number = 0;
    let columnIndex: number = 0;

    mapCells.forEach((contents) => {
      const { cell: name, ball } = contents;

      const cell = makeCellFromName(name);

      if (cell) {
        this.addCell(columnIndex, rowIndex, cell);
        columnIndex += cell.getWidth();
        if (columnIndex >= this.getNumColumns()) {
          columnIndex = 0;
          rowIndex += 1;
        }

        if (ball) {
          this.addBallToCell(cell, ball, true);
        }
      }
    });
  }

  addBallToCell(
    cell: GameCell,
    colorName: ColorName,
    duringSetup: boolean = false
  ) {
    const ball = new Ball();
    ball.color = colorName;
    ball.id = this.index;
    this.index += 1;

    if (!duringSetup) {
      cell.addBall(this, ball);
    } else {
      cell.addBall(this, ball, { duringSetup: true });
    }
  }

  launchBall(xCell: number, colorName: ColorName) {
    const entry = this.getGameCell(xCell, 0);
    if (entry && entry.cell) {
      this.addBallToCell(entry?.cell, colorName);
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
        x: entry.x * CELL_WIDTH,
        y: entry.y * CELL_WIDTH,
        width: entry.cell.getWidth() * CELL_WIDTH,
        height: entry.cell.getHeight() * CELL_WIDTH,
      };
    });
  }

  getBalls(): Array<Ball> {
    const arrayOfBalls = this.cells.map(({ x, y, cell }) => {
      const cellBalls = cell.getBalls();
      return cellBalls.map((ball) => {
        const ballCopy = new Ball(
          x * CELL_WIDTH + ball.x,
          y * CELL_WIDTH + ball.y,
          ball.id,
          ball.color
        );
        ballCopy.cellX = ball.cellX;
        ballCopy.cellY = ball.cellY;
        return ballCopy;
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
            x: entry.x * CELL_WIDTH + pos.x,
            y: entry.y * CELL_WIDTH + pos.y,
            cellY: entry.cell.cellY,
            flipped: bumper.flipped,
            onClickHandler: () => bumper.onClick(),
          });
        }
      }
    }

    return bumpers;
  }

  getToggles(): Array<CellInfo> {
    let toggles = [];
    for (let entry of this.cells) {
      if (entry.cell instanceof Toggle) {
        const toggle: Toggle = <Toggle>entry.cell;
        const pos = toggle.getTogglePosition();
        if (pos) {
          toggles.push({
            id: entry.id,
            x: entry.x * CELL_WIDTH + pos.x,
            y: entry.y * CELL_WIDTH + pos.y,
            cellY: entry.cell.cellY,
            flipped: toggle.flipped,
            onClickHandler: () => toggle.onClick(),
          });
        }
      }
    }

    return toggles;
  }

  getStoppers(): Array<CellInfo> {
    let stoppers = [];
    for (let entry of this.cells) {
      if (entry.cell instanceof Stopper) {
        const stopper: Stopper = <Stopper>entry.cell;
        const pos = stopper.getImagePosition();
        if (pos) {
          stoppers.push({
            id: entry.id,
            x: entry.x * CELL_WIDTH + pos.x,
            y: entry.y * CELL_WIDTH + pos.y,
            cellY: entry.cell.cellY,
          });
        }
      }
    }

    return stoppers;
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
            x: entry.x * CELL_WIDTH + pos.x,
            y: entry.y * CELL_WIDTH + pos.y,
            cellY: entry.cell.cellY,
            flipped: gate.flipped,
            onClickHandler: () => gate.onClick(),
          });
        }
      }
    }

    return gates;
  }

  onBallExit(cell: GameCell, ball: Ball, exitPoint?: Point) {
    cell.removeBall(ball);

    const nextCell: GameCellEntry | undefined = this.findNextCell(
      cell,
      exitPoint
    );
    if (exitPoint && nextCell) {
      nextCell.cell.addBall(this, ball);
      ball.cellX = cell.cellX + exitPoint.x;
      ball.cellY = cell.cellY + exitPoint.y;
    } else {
      const pos = this.getCellPosition(cell);
      if (
        exitPoint &&
        pos !== undefined &&
        pos.x + exitPoint.x >= 0 &&
        pos.x + exitPoint.x < this.numColumns
      ) {
        this.ballExitObservable.next([
          ball.color || 'blue',
          pos ? (pos.x + exitPoint.x + 0.5) * CELL_WIDTH : 0,
          true,
        ]);
      } else {
        this.ballDoneObservable.next([
          ball.color || 'blue',
          pos ? (pos.x + 0.5) * CELL_WIDTH : 0,
          false,
        ]);
      }
    }
  }

  conditionalBallExit(
    cell: GameCell,
    ticks: number,
    ball: Ball,
    exitPoint: Point
  ) {
    const nextCell: GameCellEntry | undefined = this.findNextCell(
      cell,
      exitPoint
    );
    if (nextCell) {
      const adjustment = mapCells(this, ticks, cell, nextCell.cell);
      if (adjustment) {
        cell.removeBall(ball);
        nextCell.cell.addBall(this, ball, adjustment);
        ball.cellX = cell.cellX + exitPoint.x;
        ball.cellY = cell.cellY + exitPoint.y;
        nextCell.cell.tick(this);
        return true;
      }
    }
    return false;
  }
}
