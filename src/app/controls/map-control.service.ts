import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// import { QuestionBase } from './question-base';

@Injectable()
export class MapControlService {
  constructor() {}

  toFormGroup(columns: number) {
    const group: any = {};

    Array<number>(columns).forEach((col, index) => {
      group[index] = new FormControl('');
    });
    return new FormGroup(group);
  }
}
