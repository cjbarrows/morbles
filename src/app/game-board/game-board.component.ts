import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { PhysicsService } from '../physics.service';
import { DrawObject } from '../drawobject';
import { ColorName } from '../ball';
import { getColorName } from '../utilities/getColorName';
import { getColorCode } from '../utilities/getColorCode';
import { ExitBallInfo } from '../exitBallInfo';

import { GAME_STATE } from '../constants';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent {
  @Input() drawList: Array<DrawObject> = [];
  @Input() numColumns: number = 3;
  @Input() startingBalls: string = '';
  @Input() endingBalls: string = '';

  @Output() notifyGameState = new EventEmitter();

  launchButtons: Array<string> = [];
  currentStyle = { left: '300px' };

  ballNumber: number = 0;

  private _gameState: GAME_STATE = 'unstarted';

  ballsAtFinish: string = '';
  exitBallInfo: Array<ExitBallInfo> = [];

  constructor(private physicsService: PhysicsService) {
    this.launchButtons = new Array<string>(this.numColumns);

    this.physicsService.ballExitObservable.subscribe(this.onBallExit);
  }

  doResetLevel() {
    console.log('resetting level');

    this.ballNumber = 0;
    this.gameState = 'unstarted';
    this.ballsAtFinish = '';
    this.exitBallInfo = [];
  }

  public set gameState(newGameState: GAME_STATE) {
    this._gameState = newGameState;

    this.notifyGameState.emit(newGameState);
  }

  public get gameState(): GAME_STATE {
    return this._gameState;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('numColumns' in changes) {
      console.log('changing columns');
      this.launchButtons = new Array<string>(this.numColumns);
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
      const colorCode = this.startingBalls[this.ballNumber];
      this.physicsService.launchBall(chuteNumber, getColorName(colorCode));

      this.ballNumber += 1;

      this.gameState = 'in progress';
    }
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
}
