import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../database.service';
import { Player } from '../player';
import { GameLevel } from '../gameLevel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  player$!: Promise<Player>;
  levels$!: Promise<Array<GameLevel>>;
  levels: Array<GameLevel> = [];

  constructor(private db: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.player$ = this.db.getAuthenticatedPlayer();
    this.levels$ = this.db.getLevels().then((levels) => (this.levels = levels));
  }

  getLevelName(id: number) {
    const level = this.levels.find((aLevel) => aLevel.id === id);
    return level ? level.name : '';
  }

  getLevelLabel(id: number): string {
    const level = this.levels.find((aLevel) => aLevel.id === id);
    if (!level?.isOfficial) {
      return '';
    }
    let sequence = 1;
    for (let i = 0; i < this.levels.length; i++) {
      if (this.levels[i].id === id) {
        break;
      }
      if (this.levels[i].isOfficial) {
        sequence += 1;
      }
    }
    return `${sequence}: `;
  }

  editLevel(event: any, levelId: number) {
    event.preventDefault();
    this.router.navigate(['/editor', levelId]);
  }

  gotoNewLevel() {
    this.router.navigate(['/editor']);
  }
}
