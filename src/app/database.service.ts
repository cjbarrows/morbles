import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { GameLevel } from './gameLevel';
import { Player } from './player';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  data: any;

  constructor(private http: HttpClient) {}

  async getLevels(): Promise<Array<GameLevel>> {
    return this.http
      .get<any>('http://127.0.0.1:8080/levels')
      .pipe(
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
      )
      .toPromise();
  }

  async getPlayer(id: number): Promise<Player> {
    try {
      const playerData: any = await this.http
        .get<any>(`http://127.0.0.1:8080/player/${id}`)
        .pipe(map((result) => result))
        .toPromise();

      return {
        id: playerData.ID,
        name: playerData.Name,
        levelStatuses: playerData.LevelStatuses.map((levelStatus: any) => ({
          levelId: levelStatus.LevelID,
          attempts: levelStatus.Attempts,
          completed: levelStatus.Completed,
        })),
      };
    } catch (error) {
      console.error(`Error getting player: ${JSON.stringify(error)}`);

      return new Player();
    }
  }

  handleError(error: any) {
    console.log('oops');
  }
}
