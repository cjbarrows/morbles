import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PhysicsService } from '../physics.service';
import { DrawObject } from '../drawobject';
import { ColorName } from '../ball';
import { getColorName } from '../utilities/getColorName';
import { getColorCode } from '../utilities/getColorCode';
import { convertShorthandMap } from '../utilities/convertShorthand';
import { EntryBallInfo } from '../entryBallInfo';
import { ExitBallInfo } from '../exitBallInfo';
import { ChuteInfo } from '../chuteInfo';
import { BallEntryComponent } from '../ball-entry/ball-entry.component';
import { GAME_STATE } from '../constants';
import { GameLevel } from '../gameLevel';
import { DatabaseService } from '../database.service';
import { RendererService } from '../renderer.service';
import { Player } from '../player';
import { LevelsComponent } from '../levels/levels.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  numColumns: number = 3;
  startingBalls: string = '';
  endingBalls: string = '';

  @Output() notifyGameState = new EventEmitter();

  @ViewChild(BallEntryComponent)
  private ballEntryComponent!: BallEntryComponent;

  @ViewChild(LevelsComponent)
  private levelsComponent!: LevelsComponent;

  launchButtons: Array<string> = [];
  currentStyle = { left: '300px' };

  ballNumber: number = 0;

  private _gameState: GAME_STATE = 'unstarted';

  entryBallInfo: Array<EntryBallInfo> = [];
  exitBallInfo: Array<ExitBallInfo> = [];
  ballsAtFinish: string = '';

  outOfBalls: boolean = false;

  level$!: Observable<GameLevel>;
  drawList: Array<DrawObject> = [];

  currentLevelId: number = 0;

  player!: Player;

  constructor(
    private physics: PhysicsService,
    private db: DatabaseService,
    private renderer: RendererService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.physics.ballExitObservable.subscribe(this.onBallExit);

    this.renderer.getDrawlistObservable().subscribe({
      next: (newDrawList: Array<DrawObject>) => {
        this.drawList = newDrawList;
      },
    });
  }

  async ngOnInit() {
    this.player = await this.db.getAuthenticatedPlayer();

    this.level$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.currentLevelId = Number(params.get('id'));
        return this.db.getLevel(this.currentLevelId);
      })
    );

    this.level$.subscribe((level) => this.setupFromLevelData(level));
  }

  getWidth(): number {
    return Math.max(
      300,
      this.physics.numColumns * 100 + this.startingBalls.length * 75
    );
  }

  getGameBoardStyle(): any {
    return {
      height: 150 + this.physics.rows * 100 + 'px',
      width: this.getWidth() + 'px',
    };
  }

  setupFromLevelData(level: GameLevel) {
    const { columns, rows, map, startingBalls, endingBalls } = level;

    this.physics.clearAll();

    this.launchButtons = new Array<string>(columns);

    this.physics.setNumColumns(columns);
    this.physics.rows = rows;

    this.physics.populateCellsFromMap(convertShorthandMap(map));

    this.startingBalls = startingBalls;
    this.endingBalls = endingBalls;

    this.doResetLevel();
  }

  doResetLevel() {
    this.ballNumber = 0;
    this.outOfBalls = false;
    this.gameState = 'unstarted';
    this.ballsAtFinish = '';
    this.entryBallInfo = this.getEntryBallsFromStartingBalls();
    this.exitBallInfo = [];
  }

  public set gameState(newGameState: GAME_STATE) {
    this._gameState = newGameState;

    this.updatePlayerStatus(this.currentLevelId, newGameState).then(() => {
      this.levelsComponent.refreshPlayer();
    });

    this.notifyGameState.emit(newGameState);
  }

  public get gameState(): GAME_STATE {
    return this._gameState;
  }

  getBallStart(index: number): number {
    return this.getWidth() - (this.startingBalls.length - index) * 60;
  }

  getEntryBallsFromStartingBalls(): Array<EntryBallInfo> {
    return this.startingBalls.split('').map((colorCode, index) => {
      return {
        x: this.getBallStart(index),
        colorCode,
        moving: false,
        chuteX: 0,
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('numColumns' in changes) {
      console.log('changing columns');
      this.launchButtons = new Array<string>(this.numColumns);
    }

    if ('startingBalls' in changes) {
      this.entryBallInfo = this.getEntryBallsFromStartingBalls();
    }

    /*
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(
        `${propName}: currentValue = ${cur}, previousValue = ${prev}`
      );
    }
    */
  }

  launch = (chuteNumber: number) => {
    if (
      !((this.gameState as string) in ['failed', 'success']) &&
      this.ballNumber < this.startingBalls.length
    ) {
      this.ballEntryComponent.launchNextBall(this.ballNumber, chuteNumber);
      this.ballNumber += 1;
      this.gameState = 'in progress';
    }
  };

  doLaunch = (chuteInfo: ChuteInfo) => {
    const { chuteNumber, ballIndex } = chuteInfo;
    const colorCode = this.startingBalls[ballIndex];

    console.log(
      `chute ${chuteNumber} launches ball ${ballIndex} with ${getColorName(
        colorCode
      )}`
    );

    this.physics.launchBall(chuteNumber, getColorName(colorCode));
  };

  onClick(drawObject: DrawObject) {
    if (drawObject.onClickHandler) {
      drawObject.onClickHandler();
    }
  }

  getDrawObjectId(index: number, drawObject: DrawObject): number {
    return drawObject.id;
  }

  onBallExit = ([colorName, x, inBounds]: [ColorName, number, boolean]) => {
    const colorCode = getColorCode(colorName);

    if (inBounds) {
      this.exitBallInfo = this.exitBallInfo.concat({ colorCode, x, inBounds });
      this.ballsAtFinish = this.ballsAtFinish.concat(colorCode);
    }

    if (this.ballsAtFinish === this.endingBalls) {
      this.gameState = 'success';
    } else if (
      this.ballsAtFinish.length === this.endingBalls.length &&
      this.ballsAtFinish !== this.endingBalls
    ) {
      this.gameState = 'failed';
    } else {
      const anyOutOfOrder = this.ballsAtFinish
        .split('')
        .some((colorCode: string, index) => {
          return colorCode !== this.endingBalls[index];
        });
      if (anyOutOfOrder || this.ballNumber === this.endingBalls.length) {
        this.gameState = 'failed';
      }
    }
  };

  onLaunchDone() {
    if (this.ballNumber >= this.startingBalls.length) {
      this.outOfBalls = true;
    }
  }

  async updatePlayerStatus(levelId: number, state: GAME_STATE) {
    let level = this.player.levelStatuses.find(
      (status) => status.levelId === levelId
    );

    if (!level) {
      level = { levelId, attempts: 0, failures: 0, completed: false };
      this.player.levelStatuses.push(level);
    }

    if (state === 'in progress') {
      level.attempts += 1;
    } else if (state === 'success') {
      level.completed = true;
    } else if (state === 'failed') {
      level.failures += 1;
    }

    return this.db.savePlayer(this.player);
  }
}
