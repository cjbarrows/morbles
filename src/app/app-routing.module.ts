import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LevelsComponent } from './levels/levels.component';
import { GameBoardComponent } from './game-board/game-board.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'game/:id', component: GameBoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
