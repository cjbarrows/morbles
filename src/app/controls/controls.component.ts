import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { PhysicsService } from '../physics.service';
import { Size } from '../size';

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
  @Output() notifySize = new EventEmitter();

  gameSettings: FormGroup;

  constructor(private fb: FormBuilder, private physicsService: PhysicsService) {
    this.gameSettings = this.fb.group({
      rows: [
        this.physicsService.rows,
        [Validators.required, minMaxSizeValidator()],
      ],
      columns: [
        this.physicsService.getNumColumns(),
        [Validators.required, minMaxSizeValidator()],
      ],
    });
  }

  ngOnInit() {
    const form = this.gameSettings;
    if (form) {
      /*
      // set initial value
      this.gameSettings.patchValue(
        {
          columns: this.physicsService.getNumColumns(),
          rows: this.physicsService.rows,
        },
        { emitEvent: false }
      );
      */

      form.valueChanges.subscribe((newSize: Size) => {
        this.notifySize.emit({ columns: newSize.columns, rows: newSize.rows });
      });

      form.controls['columns'].valueChanges.subscribe((x: any) => {
        if (!valueInRange(x)) {
          this.gameSettings.patchValue(
            {
              columns: this.gameSettings.value.columns,
            },
            { emitEvent: false }
          );
        }
      });
      form.controls['rows'].valueChanges.subscribe((x: any) => {
        if (!valueInRange(x)) {
          this.gameSettings.patchValue(
            {
              rows: this.gameSettings.value.rows,
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
