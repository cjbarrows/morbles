import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';

import { DatabaseService } from '../database.service';
import { GameLevel } from '../gameLevel';
import { Player } from '../player';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css'],
})
export class LevelsComponent implements OnInit {
  @Input() runButtonState = false;
  @Input() currentLevelId = 0;

  @Output() notifyTimer = new EventEmitter<boolean>();
  @Output() notifyLoad: EventEmitter<GameLevel> = new EventEmitter<GameLevel>();

  levels: Array<GameLevel> = [];
  player: Player = new Player();

  buttonClasses: Array<string> = [];

  constructor(private db: DatabaseService, private router: Router) {}

  async ngOnInit() {
    this.levels = await this.db.getLevels();
    this.refreshPlayer();
  }

  async refreshPlayer() {
    this.player = await this.db.getAuthenticatedPlayer();

    this.refreshButtonClasses();
  }

  refreshButtonClasses() {
    this.buttonClasses = this.player.levelStatuses.map((levelStatus, index) => {
      const startingClass = `btn${
        levelStatus.levelId === this.currentLevelId ? ' active' : ''
      }`;

      return `${startingClass} ${
        levelStatus.completed
          ? 'btn-success'
          : levelStatus.failures > 0
          ? 'btn-danger'
          : 'btn-primary'
      }`;
    });
  }

  ngOnChanges(s: SimpleChanges) {
    if ('currentLevelId' in s) {
      this.refreshButtonClasses();
    }
  }

  setTimerState(timerState: boolean) {
    this.notifyTimer.emit(timerState);
  }

  onLoadLevel(index: number) {
    // this.notifyLoad.emit(this.levels[index]);
    // this.router.navigate(['/game', { levelId: this.levels[index].id }]);
    this.router.navigate(['/game', this.levels[index].id]);
  }
}
