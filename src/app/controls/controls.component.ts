import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { FormBuilder } from '@angular/forms';

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

  // constructor(private fb: FormBuilder) {}

  gameSettings = new FormGroup({
    rows: new FormControl(7),
    columns: new FormControl(8),
  });
  // gameSettings = this.fb.group({
  //   rows: 7,
  //   columns: 8,
  // });

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
    console.log('submitting');
    console.log(this.gameSettings.value);
  }

  updateRows() {
    this.gameSettings.patchValue({ rows: 2 });
  }
}
