import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LevelsComponent } from './levels/levels.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { PlayerComponent } from './player/player.component';
import { AuthGuard } from './auth/auth.guard';
import { MapEditorComponent } from './map-editor/map-editor.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'game/:id', canActivate: [AuthGuard], component: GameBoardComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'editor', component: MapEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
