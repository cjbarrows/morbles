import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { PhysicsService } from '../physics.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css'],
})
export class MapEditorComponent implements OnInit {
  @Input() numColumns: number;
  @Input() numRows: number;

  public mapForm: any;

  makeColumns = (): FormArray => {
    return this.fb.array(
      new Array<string>(this.numColumns).fill('').map(() => {
        return this.fb.control('air');
      })
    );
  };

  makeRows = (): FormArray => {
    return this.fb.array(
      new Array<string>(this.numRows).fill('').map(() => {
        return this.makeColumns();
      })
    );
  };

  constructor(private fb: FormBuilder, private physics: PhysicsService) {
    this.numColumns = this.physics.getNumColumns();
    this.numRows = this.physics.rows;

    this.mapForm = this.fb.group({
      mapName: [''],
      rows: this.makeRows(),
    });
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.rows = this.makeRows();
  }

  get rows(): FormArray {
    return this.mapForm.get('rows') as FormArray;
  }

  set rows(f: FormArray) {
    this.mapForm.setControl('rows', this.makeRows());
  }

  getRow(n: number) {
    return this.rows.at(n) as FormArray;
  }
}
