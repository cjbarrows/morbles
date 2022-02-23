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

  editLevel(event: any, levelId: number) {
    event.preventDefault();
    this.router.navigate(['/editor', levelId]);
  }

  gotoNewLevel() {
    this.router.navigate(['/editor']);
  }
}
