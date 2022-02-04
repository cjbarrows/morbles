import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { PhysicsService } from '../physics.service';
import { DrawObject } from '../drawobject';
import { ColorName } from '../ball';
import { getColorName } from '../utilities/getColorName';
import { getColorCode } from '../utilities/getColorCode';

type GAME_STATE = 'unstarted' | 'in progress' | 'success' | 'failed';
@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  @Input() drawList: Array<DrawObject> = [];
  @Input() numColumns: number = 3;
  @Input() startingBalls: string = '';
  @Input() endingBalls: string = '';

  launchButtons: Array<string> = [];
  currentStyle = { left: '300px' };

  ballNumber: number = 0;

  gameState: GAME_STATE = 'unstarted';

  ballsAtFinish: string = '';

  constructor(private physicsService: PhysicsService) {
    this.launchButtons = new Array<string>(this.numColumns);

    this.physicsService.ballExitObservable.subscribe(this.onBallExit);
  }

  ngOnInit(): void {
    console.log('OnInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('numColumns' in changes) {
      console.log('changing columns');
      this.launchButtons = new Array<string>(this.numColumns);
    }
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(
        `${propName}: currentValue = ${cur}, previousValue = ${prev}`
      );
    }
  }

  launch = (chuteNumber: number) => {
    if (this.ballNumber < this.startingBalls.length) {
      const colorCode = this.startingBalls[this.ballNumber];
      this.physicsService.launchBall(chuteNumber, getColorName(colorCode));

      this.ballNumber += 1;
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

  onBallExit = (colorName: ColorName) => {
    console.log(`ball exiting: ${colorName}`);

    const colorCode = getColorCode(colorName);
    this.ballsAtFinish = this.ballsAtFinish.concat(colorCode);

    if (this.ballsAtFinish === this.endingBalls) {
      console.log('you win!');
    } else if (
      this.ballsAtFinish.length === this.endingBalls.length &&
      this.ballsAtFinish !== this.endingBalls
    ) {
      console.log('you lose!');
    } else {
      const anyOutOfOrder = this.ballsAtFinish
        .split('')
        .some((colorCode: string, index) => {
          return colorCode !== this.endingBalls[index];
        });
      if (anyOutOfOrder) {
        console.log('you lose!');
      }
    }
  };
}
