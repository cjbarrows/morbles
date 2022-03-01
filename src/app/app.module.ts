import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ControlsComponent } from './controls/controls.component';
import { LaunchButtonsComponent } from './launch-button/launch-button.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { BallExitComponent } from './ball-exit/ball-exit.component';
import { BallEntryComponent } from './ball-entry/ball-entry.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { LevelsComponent } from './levels/levels.component';
import { PlayerComponent } from './player/player.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToastsComponent } from './toasts/toasts.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    ControlsComponent,
    LaunchButtonsComponent,
    MapEditorComponent,
    BallExitComponent,
    BallEntryComponent,
    LoginComponent,
    LevelsComponent,
    PlayerComponent,
    NavbarComponent,
    ToastsComponent,
    ModalComponent,
  ],
  entryComponents: [ModalComponent],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
