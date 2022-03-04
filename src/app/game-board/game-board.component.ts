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
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

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
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  numColumns: number = 3;
  startingBalls: string = '';
  endingBalls: string = '';

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
  level!: GameLevel;

  currentLevelId: number = 0;
  showPremodal: boolean = true;

  player!: Player;

  constructor(
    private physics: PhysicsService,
    private db: DatabaseService,
    private renderer: RendererService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
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
        this.showPremodal =
          this.route.snapshot.queryParamMap.get('premodal') === 'false'
            ? false
            : true;
        return this.db.getLevel(this.currentLevelId);
      })
    );

    this.level$.subscribe((level) => {
      this.level = level;
      this.setupFromLevelData(this.showPremodal);
    });
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

  setupFromLevelData(showModal: boolean = true) {
    const { name, hint, columns, rows, map, startingBalls, endingBalls } =
      this.level;

    this.physics.clearAll();

    this.launchButtons = new Array<string>(columns);

    this.physics.setNumColumns(columns);
    this.physics.rows = rows;

    this.physics.populateCellsFromMap(convertShorthandMap(map));

    this.startingBalls = startingBalls;
    this.endingBalls = endingBalls;

    this.doResetLevel(name, hint, showModal);
  }

  doResetLevel(name: string, hint: string, showModal: boolean = true) {
    this.ballNumber = 0;
    this.outOfBalls = false;
    this.gameState = 'unstarted';
    this.ballsAtFinish = '';
    this.entryBallInfo = this.getEntryBallsFromStartingBalls();
    this.exitBallInfo = [];

    if (showModal) {
      this.showPlayModal(name, hint);
    } else {
      this.gameState = 'in progress';
    }
  }

  showPlayModal(name: string, hint: string) {
    const options: NgbModalOptions = {
      backdropClass: 'app-session-modal-backdrop',
      windowClass: 'app-session-modal-window',
      centered: true,
    };

    const modalRef = this.modalService.open(ModalComponent, options);
    modalRef.componentInstance.my_modal_title = `${this.currentLevelId}: ${name}`;
    modalRef.componentInstance.my_modal_content = hint;
    modalRef.result.then(
      () => {},
      (reason) => {
        switch (reason) {
          case 'play':
            this.gameState = 'open';
            break;
          case 'cancel':
          default:
            this.router.navigate(['/levels']);
        }
      }
    );
  }

  async showEndModal(gameState: GAME_STATE) {
    if (this.modalService.hasOpenModals()) {
      return;
    }

    const options: NgbModalOptions = {
      backdropClass: 'app-session-modal-backdrop',
      windowClass: 'app-session-modal-window',
      centered: true,
    };

    const modalRef = this.modalService.open(ModalComponent, options);

    switch (gameState) {
      case 'success':
        const allDone = this.hasCurrentPlayerCompletedAllLevels();

        if (allDone) {
          modalRef.componentInstance.my_modal_title = 'Level Complete';
          modalRef.componentInstance.my_modal_content =
            "Congratulations! You've won it all!";
          modalRef.componentInstance.playNext = false;
          modalRef.componentInstance.showPlayButton = false;
        } else {
          const nextLevelId = this.getNextIncompleteLevelForPlayer(
            this.currentLevelId
          );

          if (nextLevelId !== -1) {
            modalRef.componentInstance.my_modal_title = 'Level Complete';
            modalRef.componentInstance.my_modal_content =
              'Congratulations! Click Play to go on to the next level!';
            modalRef.componentInstance.playNext = nextLevelId;
            modalRef.componentInstance.showPlayButton = true;
          } else {
            modalRef.componentInstance.my_modal_title = 'Level Complete';
            modalRef.componentInstance.my_modal_content =
              "That's the last level. No go back and finish the ones you missed.";
            modalRef.componentInstance.playNext = false;
            modalRef.componentInstance.showPlayButton = false;
          }
        }
        break;
      case 'failed':
        modalRef.componentInstance.my_modal_title = 'Level Failed';
        modalRef.componentInstance.my_modal_content = 'Better luck next time!';
        modalRef.componentInstance.playNext = false;
        modalRef.componentInstance.showPlayButton = true;
        break;
    }

    modalRef.result.then(
      () => {},
      async (reason) => {
        switch (reason) {
          case 'play':
            this.setupFromLevelData(false);
            break;
          case 'next':
            this.router.navigate(
              ['/game/', modalRef.componentInstance.playNext],
              {
                queryParams: { premodal: false },
              }
            );
            break;
          case 'cancel':
          default:
            break;
        }
      }
    );
  }

  public set gameState(newGameState: GAME_STATE) {
    this._gameState = newGameState;

    this.updatePlayerStatus(this.currentLevelId, newGameState).then(() => {
      this.levelsComponent.refreshPlayer();
    });

    switch (newGameState) {
      case 'success':
      case 'failed':
        this.showEndModal(newGameState);
        break;
      default:
        break;
    }
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

    this.physics.launchBall(chuteNumber, getColorName(colorCode));
    this.renderer.forceRedraw(this.physics);
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
    } else {
      this.setGameStateAccordingToCompletedBalls(this.ballsAtFinish.length);
    }
  };

  setGameStateAccordingToCompletedBalls(ballCount: number) {
    const ballsToCheck = this.ballsAtFinish.substr(0, ballCount);

    if (ballsToCheck === this.endingBalls) {
      this.gameState = 'success';
    } else if (
      ballsToCheck.length === this.endingBalls.length &&
      ballsToCheck !== this.endingBalls
    ) {
      this.gameState = 'failed';
    } else {
      const anyOutOfOrder = ballsToCheck
        .split('')
        .some((colorCode: string, index) => {
          return colorCode !== this.endingBalls[index];
        });
      if (anyOutOfOrder || ballsToCheck.length === this.endingBalls.length) {
        this.gameState = 'failed';
      }
    }
  }

  onLaunchDone() {
    if (this.ballNumber >= this.startingBalls.length) {
      this.outOfBalls = true;
    }
  }

  hasCurrentPlayerCompletedAllLevels() {
    return (
      this.player.levelStatuses.filter((levelStatus) => !levelStatus.completed)
        .length === 0
    );
  }

  getNextIncompleteLevelForPlayer(currentLevelId: number): number {
    for (let i = 0; i < this.player.levelStatuses.length; i++) {
      const levelStatus = this.player.levelStatuses[i];
      if (levelStatus.levelId === currentLevelId) {
        for (let j = 1; j <= this.player.levelStatuses.length; j++) {
          const index = (i + j) % this.player.levelStatuses.length;
          const nextLevelStatus = this.player.levelStatuses[index];
          if (!nextLevelStatus.completed) {
            return nextLevelStatus.levelId;
          }
        }
      }
    }
    return -1;
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

  onAnimationExitDone(ballNumber: number) {
    this.setGameStateAccordingToCompletedBalls(ballNumber);
  }
}
