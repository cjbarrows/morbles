import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

interface GameSettings {
  rows: number;
}

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent {
  @Input() buttonState = false;

  @Output() notifyTimer = new EventEmitter<boolean>();
  @Output() notifyLoad = new EventEmitter();
  @Output() notifyExamine = new EventEmitter();

  @Input() gameSettings: GameSettings = { rows: 10 };

  setTimerState(timerState: boolean) {
    this.notifyTimer.emit(timerState);
  }

  onLoadLevel() {
    this.notifyLoad.emit();
  }

  onExamine() {
    this.notifyExamine.emit();
  }

  onSubmit() {
    console.log('submitted!');
  }
}
