import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  Subject,
  Observable,
  of,
  switchMap,
  map,
  merge,
  takeUntil,
} from 'rxjs';

import { BlankGameLevel, GameLevel } from '../gameLevel';
import { DatabaseService } from '../database.service';
import { PhysicsService } from '../physics.service';
import {
  convertShorthandMap,
  convertMapToShorthand,
} from '../utilities/convertShorthand';
import { CellContents } from '../types/cellContents';
import { GameCell } from '../cells/gamecell';
import { getAllCellTypes, getCellFromName } from '../cellFactory';
import { GameBoardComponent } from '../game-board/game-board.component';

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
  startingMap: Array<CellContents> = [];
  startingBalls: string = '';
  endingBalls: string = '';

  public mapForm: any;

  isSaving: boolean = false;

  level$!: Observable<GameLevel>;
  currentLevelId: number = 0;
  level: GameLevel = { ...BlankGameLevel };

  isDisabled: boolean = true;

  changesUnsubscribe = new Subject();

  @ViewChild(GameBoardComponent)
  private gameBoardComponent!: GameBoardComponent;

  constructor(
    private fb: FormBuilder,
    private physics: PhysicsService,
    private db: DatabaseService,
    private route: ActivatedRoute
  ) {}

  padFormRowToWidth(rowIndex: number, columnIndex: number) {
    const row = this.getRow(rowIndex);

    const columnCount = row.controls.reduce(
      (accum, control: AbstractControl) => {
        const cellType = control.value;
        const cell: GameCell | null = getCellFromName(cellType);

        return accum + (cell ? cell?.getWidth() : 0);
      },
      0
    );

    const missing = this.physics.numColumns - columnCount;
    for (let i: number = 0; i < missing; i++) {
      row.insert(columnIndex + 1, this.fb.control('air'));
    }
    const extra = columnCount - this.physics.numColumns;
    for (let i: number = 0; i < extra; i++) {
      row.removeAt(columnIndex + 1);
    }
  }

  onValueChanged(changes: any) {
    const { columnIndex, rowIndex } = changes.controlEntry;
    this.padFormRowToWidth(rowIndex, columnIndex);
  }

  onMapChange() {
    this.level.map = convertMapToShorthand(
      this.mapForm.get('rows').value.flat()
    );
    this.gameBoardComponent.setLevel(this.level, false);
  }

  watchForChanges(rowControl: FormArray) {
    // cleanup any prior subscriptions before re-establishing new ones
    this.changesUnsubscribe.next('');

    const controls = rowControl.controls.reduce(
      (accum: any, rowControl: AbstractControl, rowIndex: number) => {
        const colControls = (rowControl as FormArray).controls.map(
          (control: AbstractControl, columnIndex: number) => ({
            columnIndex,
            rowIndex,
            control,
          })
        );
        return [...accum, ...colControls];
      },
      []
    );

    merge(
      ...controls.map((controlEntry) =>
        controlEntry.control.valueChanges.pipe(
          takeUntil(this.changesUnsubscribe),
          map((value) => ({ controlEntry, data: value }))
        )
      )
    ).subscribe((changes) => {
      this.onValueChanged(changes);
    });

    rowControl.valueChanges.subscribe(() => this.onMapChange());
  }

  makeRows = (oldColumns?: number): FormArray => {
    let cellIndex = 0;
    let cellCount = 0;
    const numCols = this.physics.getNumColumns();
    const numRows = this.physics.rows;
    const controls: FormArray = this.fb.array(
      new Array<string>(numRows).fill('').map(() => new FormArray([]))
    );

    while (cellCount < numRows * numCols) {
      const numColumnsToUse = oldColumns ? oldColumns : numCols;
      const colIndex = cellCount % numColumnsToUse;
      const rowIndex = Math.floor(cellCount / numColumnsToUse);
      const isNewCell =
        cellIndex >= this.startingMap.length ||
        (oldColumns && colIndex >= oldColumns);
      const cellType = isNewCell ? 'air' : this.startingMap[cellIndex].cell;
      const cell: GameCell | null = getCellFromName(cellType);
      const cellWidth = cell ? cell.getWidth() : 1;
      const control = this.fb.control(cellType);

      const row = controls.at(rowIndex) as FormArray;
      if (row) {
        row.push(control);
      }

      cellIndex += 1;
      cellCount += cellWidth;
    }

    this.watchForChanges(controls);

    return controls;
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
      if (this.mapForm) {
        this.physics.numColumns = level.columns;
        this.physics.numRows = level.rows;
        this.mapForm.patchValue({
          mapName: level.name,
          hint: level.hint,
          startingBalls: level.startingBalls,
          endingBalls: level.endingBalls,
          numRows: level.rows,
          numColumns: level.columns,
        });
      }
      this.rows = this.makeRows();

      this.level = { ...level };
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
        const oldColumns = this.physics.numColumns;
        this.physics.setNumColumns(newValue);
        this.rows = this.makeRows(oldColumns);
        this.startingMap = convertShorthandMap(
          convertMapToShorthand(this.mapForm.get('rows').value.flat())
        );
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

    GameCell.inEditingMode = true;
    GameCell.onCellChange = (cell: GameCell) => this.onGameCellChange(cell);
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
      this.mapForm.setControl('rows', f || this.makeRows());
    }
  }

  getRow(n: number): FormArray {
    return this.rows.at(n) as FormArray;
  }

  getCellType(r: number, c: number) {
    try {
      const cell = this.getRow(r).at(c);
      if (cell) {
        return cell.value;
      }
    } catch (error) {}
    return undefined;
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

  getCellOptions(_row: number, column: number) {
    const allCellTypes = getAllCellTypes();

    const filtered = allCellTypes
      .filter((cellType) => {
        return (
          column + new cellType.constructor().getWidth() <=
          this.physics.getNumColumns()
        );
      })
      .map((cellType) => {
        return { label: cellType.label, value: cellType.code };
      });

    return filtered;
  }
  getCellOptionValue(_index: number, item: any) {
    return item.value;
  }

  onGameCellChange(cell: GameCell) {
    console.log('here');
    console.log(cell.serialize());
    console.log(cell);
    const colIndex = this.physics.getColumnIndexForCell(cell);
    console.log(colIndex);
    // TODO: change this in the form control array, using the new .serialize
  }
}
