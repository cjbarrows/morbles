import { Component } from '@angular/core';

import { RendererService } from './renderer.service';
import { PhysicsService } from './physics.service';
import { DatabaseService } from './database.service';
import { Size } from './size';
import { GameLevel } from './gameLevel';
import { Player } from './player';
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

  player: Player = new Player();

  currentPlayerStatus: Array<LevelStatus> = [];

  constructor(
    public physics: PhysicsService,
    private renderer: RendererService,
    private db: DatabaseService
  ) {
    this.renderer.createDrawlistFromPhysics(this.physics);

    this.startClock();
  }

  async ngOnInit() {
    try {
      this.levels = await this.db.getLevels();
    } catch (error) {
      this.levels = [];
    }

    try {
      this.player = await this.db.getAuthenticatedPlayer();
    } catch (error) {
      this.player = new Player();
    }

    this.refreshPlayerStatus();
  }

  refreshPlayerStatus() {
    this.currentPlayerStatus = this.getPlayerStatus(this.levels);
  }

  getPlayerStatus(levels: Array<GameLevel>): Array<LevelStatus> {
    const playerLevelsCompleted = levels.map((level) => {
      const lookupLevel: any = this.player.levelStatuses.find(
        (playerLevel) => playerLevel.levelId === level.id
      );
      return lookupLevel
        ? { ...lookupLevel }
        : {
            levelId: level.id,
            attempts: 0,
            failures: 0,
            completed: false,
            isOfficial: false,
          };
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

  onNotifySize(size: Size) {
    this.physics.setNumColumns(size.columns);
    this.physics.rows = size.rows;
  }

  getRenderer(): RendererService {
    return this.renderer;
  }
}
