import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { GameBoard } from '../gameboard';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  @Input() gameBoard: GameBoard = new GameBoard([]);

  constructor() {}

  ngOnInit(): void {
    console.log('OnInit');
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   for (const propName in changes) {
  //     const chng = changes[propName];
  //     const cur = JSON.stringify(chng.currentValue);
  //     const prev = JSON.stringify(chng.previousValue);
  //     console.log(
  //       `${propName}: currentValue = ${cur}, previousValue = ${prev}`
  //     );
  //   }
  // }

  examine() {
    console.log(this.gameBoard);
  }
}
