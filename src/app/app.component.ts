import { Component, ViewChild } from '@angular/core';

import { GameBoardComponent } from './game-board/game-board.component';
import { RendererService } from './renderer.service';
import { PhysicsService } from './physics.service';
import { getCellFromName } from './cellFactory';
import { Size } from './size';
import { convertShorthandMap } from './utilities/convertShorthand';
import { BallOrder } from './ballOrder';
import { GameLevel } from './gameLevel';
import { level1, level2, level3, level4 } from './levels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular Pachinko';

  timer: any;
  running = false;

  TIME_PER_FRAME = 33;

  mapName: string = '';
  startMap: Array<string> = [];
  startingBalls: string = '';
  endingBalls: string = '';

  levels: Array<GameLevel> = [level1, level2, level3, level4];

  @ViewChild(GameBoardComponent)
  private gameBoardComponent!: GameBoardComponent;

  constructor(
    public physics: PhysicsService,
    private renderer: RendererService
  ) {
    this.renderer.createDrawlistFromPhysics(this.physics);

    this.startClock();
  }

  startClock() {
    this.running = true;
    this.runClock();
  }

  stopClock() {
    this.running = false;
  }

  runClock() {
    this.timer = setTimeout(() => {
      this.tick();
    }, this.TIME_PER_FRAME);
  }

  tick() {
    this.physics.tick();
    this.renderer.createDrawlistFromPhysics(this.physics);

    if (this.running) {
      this.runClock();
    }
  }

  onNotifyTimer(startTimer: boolean) {
    if (startTimer) {
      this.startClock();
    } else {
      this.stopClock();
    }
  }

  onNotifyExamine() {
    console.log(this.renderer.getDrawlist());
  }

  onNotifyLoad(levelIndex: number) {
    const { name, columns, rows, map, startingBalls, endingBalls } =
      this.levels[levelIndex];

    this.gameBoardComponent.doResetLevel();

    this.physics.clearAll();

    this.mapName = name;

    this.physics.setNumColumns(columns);
    this.physics.rows = rows;

    this.startMap = convertShorthandMap(map);

    this.startingBalls = startingBalls;
    this.endingBalls = endingBalls;
  }

  onNotifySize(size: Size) {
    this.physics.setNumColumns(size.columns);
    this.physics.rows = size.rows;
  }

  onNotifyLoadMap(mapCells: Array<string>) {
    this.physics.clearAll();

    mapCells.forEach((name, index) => {
      const cell = getCellFromName(name);

      const x = index % this.physics.getNumColumns();
      const y = (index - x) / this.physics.getNumColumns();
      this.physics.addCell(x, y, cell);
    });
  }

  onNotifyCellChange(cellChange: any) {
    const x: number = cellChange.cellIndex % this.physics.getNumColumns();
    const y: number = (cellChange.cellIndex - x) / this.physics.getNumColumns();

    const cell = getCellFromName(cellChange.value);

    this.physics.setCell(x, y, cell);
  }

  onNotifyBallOrderChange(changeToOrder: BallOrder) {
    if (changeToOrder.startingBalls) {
      this.startingBalls = changeToOrder.startingBalls;
    }
    if (changeToOrder.endingBalls) {
      this.endingBalls = changeToOrder.endingBalls;
    }
  }

  getRenderer(): RendererService {
    return this.renderer;
  }
}
