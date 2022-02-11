import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { GameLevel } from './gameLevel';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  data: any;

  constructor(private http: HttpClient) {}

  getLevels() {
    return this.http.get<any>('http://127.0.0.1:8080/levels').pipe(
      map((result) =>
        result.map((level: any) => ({
          id: level.ID,
          name: level.Name,
          hint: level.Hint,
          rows: level.Rows,
          columns: level.Columns,
          startingBalls: level.StartingBalls,
          endingBalls: level.EndingBalls,
          map: level.MapData,
        }))
      )
    );
  }

  handleError(error: any) {
    console.log('oops');
  }
}
