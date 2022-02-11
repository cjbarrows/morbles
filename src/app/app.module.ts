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

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    ControlsComponent,
    LaunchButtonsComponent,
    MapEditorComponent,
    BallExitComponent,
    BallEntryComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
