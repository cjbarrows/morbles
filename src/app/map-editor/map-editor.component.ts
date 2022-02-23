import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

import { BlankGameLevel, GameLevel } from '../gameLevel';
import { DatabaseService } from '../database.service';
import { PhysicsService } from '../physics.service';
import {
  convertShorthandMap,
  convertMapToShorthand,
} from '../utilities/convertShorthand';

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
  mapName: String = '';
  startingMap: Array<string> = [];
  startingBalls: string = '';
  endingBalls: string = '';

  public mapForm: any;

  isSaving: boolean = false;

  level$!: Observable<GameLevel>;
  currentLevelId: number = 0;

  constructor(
    private fb: FormBuilder,
    private physics: PhysicsService,
    private db: DatabaseService,
    private route: ActivatedRoute
  ) {}

  makeColumns = (rowIndex: number): FormArray => {
    return this.fb.array(
      new Array<string>(this.physics.getNumColumns())
        .fill('')
        .map((_, colIndex) => {
          const index = rowIndex * this.physics.getNumColumns() + colIndex;
          const cellType =
            this.startingMap.length > index
              ? this.startingMap[
                  rowIndex * this.physics.getNumColumns() + colIndex
                ]
              : 'air';
          return this.fb.control(cellType);
        })
    );
  };

  makeRows = (): FormArray => {
    return this.fb.array(
      new Array<string>(this.physics.rows).fill('').map((_, rowIndex) => {
        return this.makeColumns(rowIndex);
      })
    );
  };

  ngOnInit(): void {
    this.level$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const levelId = Number(params.get('id'));
        if (levelId > 0) {
          this.currentLevelId = levelId;
          return this.db.getLevel(this.currentLevelId);
        }
        return of(BlankGameLevel);
      })
    );

    this.level$.subscribe((level) => {
      this.startingMap = convertShorthandMap(level.map);
      this.mapForm.patchValue({
        mapName: level.name,
        hint: level.hint,
        startingBalls: level.startingBalls,
        endingBalls: level.endingBalls,
        numRows: level.rows,
        numColumns: level.columns,
      });
      this.rows = this.makeRows();
    });

    this.mapForm = this.fb.group({
      mapName: ['', [Validators.required]],
      hint: '',
      startingBalls: ['', [colorCodeValidator()]],
      endingBalls: ['', [colorCodeValidator()]],
      rows: this.makeRows(),
      numRows: [this.physics.rows],
      numColumns: [this.physics.getNumColumns()],
    });

    this.mapForm.controls['numRows'].valueChanges.subscribe((newValue: any) => {
      this.physics.numRows = newValue;
      this.rows = this.makeRows();
    });

    this.mapForm.controls['numColumns'].valueChanges.subscribe(
      (newValue: any) => {
        this.physics.setNumColumns(newValue);
        this.rows = this.makeRows();
      }
    );

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
      }
    );
  }

  getAllCells() {
    return this.mapForm.controls['rows'].controls
      .map((row: FormArray) => row.controls.map((cell) => cell))
      .flat();
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

  async saveMap() {
    this.isSaving = true;

    await this.db.saveMap({
      id: this.currentLevelId === 0 ? -1 : this.currentLevelId,
      rows: this.mapForm.get('numRows').value,
      columns: this.mapForm.get('numColumns').value,
      name: this.mapForm.get('mapName').value,
      hint: this.mapForm.get('hint').value,
      startingBalls: this.mapForm.get('startingBalls').value,
      endingBalls: this.mapForm.get('endingBalls').value,
      map: convertMapToShorthand(this.mapForm.get('rows').value.flat()),
    });

    this.isSaving = false;
  }
}
