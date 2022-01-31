import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

interface GameSettings {
  rows: number;
}

const valueInRange = (value: number) => {
  return value >= 3 && value <= 10;
};

export function minMaxSizeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !valueInRange(control.value)
      ? { tooBigOrTooSmall: { value: control.value } }
      : null;
  };
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

  constructor(private fb: FormBuilder) {}

  gameSettings = this.fb.group({
    rows: 7,
    columns: [8, [Validators.required, minMaxSizeValidator()]],
  });

  ngOnInit() {
    const form = this.gameSettings;
    if (form) {
      form.controls['columns'].valueChanges.subscribe((x: any) => {
        console.log('control value changed');
        console.log('change');
        console.log(x);
        console.log('current');
        console.log((this.gameSettings.get('columns') || {}).value);
        console.log('or');
        console.log(this.gameSettings.value);
        if (!valueInRange(x)) {
          this.gameSettings.patchValue(
            {
              columns: this.gameSettings.value.columns,
            },
            { emitEvent: false }
          );
        }
      });
    }
  }

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
