import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LevelsComponent } from './levels/levels.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { PlayerComponent } from './player/player.component';
import { AuthGuard } from './auth/auth.guard';
import { MapEditorComponent } from './map-editor/map-editor.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: LevelsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'levels', canActivate: [AuthGuard], component: LevelsComponent },
  { path: 'game/:id', canActivate: [AuthGuard], component: GameBoardComponent },
  { path: 'player', canActivate: [AuthGuard], component: PlayerComponent },
  {
    path: 'editor/:id',
    canActivate: [AuthGuard],
    component: MapEditorComponent,
  },
  { path: 'editor', canActivate: [AuthGuard], component: MapEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
