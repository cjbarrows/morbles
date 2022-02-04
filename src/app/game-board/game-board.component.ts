import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { PhysicsService } from '../physics.service';
import { DrawObject } from '../drawobject';
import { getColorName } from '../utilities/getColorName';

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

  constructor(private physicsService: PhysicsService) {
    this.launchButtons = new Array<string>(this.numColumns);
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
}
