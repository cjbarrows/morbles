import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
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
import { GameLevel } from '../gameLevel';
import { LevelStatus } from '../levelStatus';

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
  @Input() runButtonState = false;
  @Input() levels: Array<GameLevel> = [];
  @Input() playerStatus: Array<LevelStatus> = [];

  @Output() notifyTimer = new EventEmitter<boolean>();
  @Output() notifyLoad: EventEmitter<GameLevel> = new EventEmitter<GameLevel>();
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

  onLoadLevel(index: number) {
    this.notifyLoad.emit(this.levels[index]);
  }

  onSubmit() {
    console.log('submitting');
    console.log(this.gameSettings.value);
  }

  updateRows() {
    this.gameSettings.patchValue({ rows: 2 });
  }

  getClassNameForButton(i: number) {
    if (this.playerStatus[i].completed) {
      return 'btn btn-success';
    } else if (this.playerStatus[i].attempts > 0) {
      return 'btn btn-danger';
    }
    return 'btn btn-primary';
  }
}
