import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

// import { GameBoard } from '../gameboard';
import { PhysicsService } from '../physics.service';
import { DrawObject } from '../drawobject';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  @Input() drawList: Array<DrawObject> = [];
  launchButtons: Array<string> = [];
  currentStyle = { left: '300px' };

  constructor(private physicsService: PhysicsService) {
    this.launchButtons = new Array<string>(8);
  }

  ngOnInit(): void {
    console.log('OnInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    this.physicsService.launchBall(chuteNumber);
  };

  onClick(drawObject: DrawObject) {
    console.log(this.physicsService);

    if (drawObject.onClickHandler) {
      drawObject.onClickHandler();
    }
  }

  getDrawObjectId(index: number, drawObject: DrawObject): number {
    return drawObject.id;
  }
}
