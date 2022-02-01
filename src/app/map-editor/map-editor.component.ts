import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css'],
})
export class MapEditorComponent implements OnInit {
  mapForm = this.fb.group({
    mapName: [''],
    aliases: this.fb.array([this.fb.control('')]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  get aliases() {
    return this.mapForm.get('aliases') as FormArray;
  }

  addAlias() {
    this.aliases.push(this.fb.control(''));
  }
}
