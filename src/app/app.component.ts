import { Component, ViewChild } from '@angular/core';

import { GameBoardComponent } from './game-board/game-board.component';
import { RendererService } from './renderer.service';
import { PhysicsService } from './physics.service';
import { DatabaseService } from './database.service';
import { getCellFromName } from './cellFactory';
import { Size } from './size';
import { convertShorthandMap } from './utilities/convertShorthand';
import { BallOrder } from './ballOrder';
import { GameLevel } from './gameLevel';
import { Player } from './player';
import { GAME_STATE } from './constants';
import { LevelStatus } from './levelStatus';

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
  currentLevelId?: number = undefined;

  levels: Array<GameLevel> = [];

  @ViewChild(GameBoardComponent)
  private gameBoardComponent!: GameBoardComponent;

  player: Player;

  currentPlayerStatus: Array<LevelStatus> = [];

  constructor(
    public physics: PhysicsService,
    private renderer: RendererService,
    private db: DatabaseService
  ) {
    this.renderer.createDrawlistFromPhysics(this.physics);

    /*
    this.levels = [];
    */
    //*
    this.db.getLevels().subscribe((data) => {
      this.levels = data;
      this.refreshPlayerStatus();
    });
    //*/

    this.player = new Player('Test Player');

    this.refreshPlayerStatus();

    this.startClock();
  }

  refreshPlayerStatus() {
    this.currentPlayerStatus = this.getPlayerStatus();
  }

  getPlayerStatus(): Array<LevelStatus> {
    const playerLevelsCompleted = this.levels.map((level) => {
      const lookupLevel = this.player.levelStatuses.find(
        (playerLevel) => playerLevel.levelId === level.id
      );
      return lookupLevel
        ? { ...lookupLevel }
        : { levelId: level.id, attempts: 0, completed: false };
    });

    return playerLevelsCompleted;
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
    const { id, name, columns, rows, map, startingBalls, endingBalls } =
      this.levels[levelIndex];

    this.gameBoardComponent.doResetLevel();

    this.physics.clearAll();

    this.mapName = name;

    this.physics.setNumColumns(columns);
    this.physics.rows = rows;

    this.startMap = convertShorthandMap(map);

    this.startingBalls = startingBalls;
    this.endingBalls = endingBalls;

    this.currentLevelId = id;
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

  onNotifyGameState(state: GAME_STATE) {
    if (this.currentLevelId) {
      if (state === 'success') {
        this.updatePlayerStatus(this.currentLevelId, state);
      } else if (state === 'failed') {
        this.updatePlayerStatus(this.currentLevelId, state);
      }
    }
  }

  updatePlayerStatus(levelId: number, state: GAME_STATE) {
    let level = this.player.levelStatuses.find(
      (status) => status.levelId === levelId
    );

    if (!level) {
      level = { levelId, attempts: 0, completed: false };
      this.player.levelStatuses.push(level);
    }
    if (state === 'success') {
      level.attempts += 1;
      level.completed = true;
    } else if (state === 'failed') {
      level.attempts += 1;
    }

    this.refreshPlayerStatus();
  }

  getRenderer(): RendererService {
    return this.renderer;
  }
}
