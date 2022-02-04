import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, merge } from 'rxjs';

import { PhysicsService } from '../physics.service';
import { BallOrder } from '../ballOrder';

function colorCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const colorCodeRe: RegExp = /[RGBP]+$/;

    return !colorCodeRe.test(control.value)
      ? { notColorCode: { value: control.value } }
      : null;
  };
}

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css'],
})
export class MapEditorComponent implements OnInit {
  @Input() numColumns: number;
  @Input() numRows: number;
  @Input() startingMap: Array<string> = [];

  @Output() notifyCellChange = new EventEmitter();
  @Output() notifyLoadMap = new EventEmitter();
  @Output() notifyBallOrderChange = new EventEmitter<BallOrder>();

  public mapForm: any;

  makeColumns = (rowIndex: number): FormArray => {
    return this.fb.array(
      new Array<string>(this.numColumns).fill('').map((_, colIndex) => {
        const index = rowIndex * this.numColumns + colIndex;
        const cellType =
          this.startingMap.length > index
            ? this.startingMap[rowIndex * this.numColumns + colIndex]
            : 'air';
        return this.fb.control(cellType);
      })
    );
  };

  makeRows = (): FormArray => {
    return this.fb.array(
      new Array<string>(this.numRows).fill('').map((_, rowIndex) => {
        return this.makeColumns(rowIndex);
      })
    );
  };

  constructor(private fb: FormBuilder, private physics: PhysicsService) {
    this.numColumns = this.physics.getNumColumns();
    this.numRows = this.physics.rows;
  }

  ngOnInit(): void {
    this.mapForm = this.fb.group({
      mapName: [''],
      startingBalls: ['', [colorCodeValidator()]],
      endingBalls: ['', [colorCodeValidator()]],
      rows: this.makeRows(),
    });

    this.mapForm.controls['startingBalls'].valueChanges.subscribe(
      (newOrder: string) => {
        const newOrderInUpperCase = newOrder.toUpperCase();
        this.mapForm.patchValue(
          {
            startingBalls: newOrderInUpperCase,
          },
          {
            emitEvent: false,
          }
        );
        this.notifyBallOrderChange.emit({ startingBalls: newOrderInUpperCase });
      }
    );

    this.mapForm.controls['endingBalls'].valueChanges.subscribe(
      (newOrder: string) => {
        const newOrderInUpperCase = newOrder.toUpperCase();
        this.mapForm.patchValue(
          {
            endingBalls: newOrderInUpperCase,
          },
          {
            emitEvent: false,
          }
        );
        this.notifyBallOrderChange.emit({ endingBalls: newOrderInUpperCase });
      }
    );

    this.subscribeToCellChanges();

    this.doNotifyLoadMap();
  }

  getAllCells() {
    return this.mapForm.controls['rows'].controls
      .map((row: FormArray) => row.controls.map((cell) => cell))
      .flat();
  }

  subscribeToCellChanges() {
    if (this.mapForm) {
      merge(
        ...this.getAllCells().map((control: AbstractControl, index: number) =>
          control.valueChanges.pipe(
            map((value: any) => ({ cellIndex: index, value }))
          )
        )
      ).subscribe((change: any) => {
        this.notifyCellChange.emit(change);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('startingMap' in changes) {
      const change: SimpleChange = changes['startingMap'];
      const map: Array<string> = change.currentValue;
      this.notifyLoadMap.emit(map);
    }

    // TODO: not sure if we need/are able to unsubscribe,
    //  especially since we aren't getting a "subscription" back
    //  for each control -- just one for all of them
    this.rows = this.makeRows();
    this.subscribeToCellChanges();
  }

  get rows(): FormArray {
    return this.mapForm.get('rows') as FormArray;
  }

  set rows(f: FormArray) {
    if (this.mapForm) {
      this.mapForm.setControl('rows', this.makeRows() || f);
    }
  }

  getRow(n: number) {
    return this.rows.at(n) as FormArray;
  }

  doNotifyLoadMap() {
    this.notifyLoadMap.emit(this.mapForm.value.rows.flat());
  }
}
