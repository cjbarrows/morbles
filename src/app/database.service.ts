import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { GameLevel } from './gameLevel';
import { Player } from './player';

const convertToDatabaseLevel = (level: GameLevel) => ({
  ID: level.id,
  Name: level.name,
  Hint: level.hint,
  Rows: level.rows,
  Columns: level.columns,
  StartingBalls: level.startingBalls,
  EndingBalls: level.endingBalls,
  MapData: level.map,
});

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  postLoginUrl: string = '';

  cachedIsLoggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  async login(username: string, password: string) {
    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    this.http
      .post('http://localhost:8080/login', formData, { withCredentials: true })
      .subscribe(
        (response) => console.log(response),
        (error) => console.error(error)
      );
  }

  logout() {
    this.http
      .get('http://localhost:8080/api/logout', { withCredentials: true })
      .subscribe(
        (response) => {
          this.cachedIsLoggedIn = false;
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  showMe() {
    this.http
      .get('http://localhost:8080/api/me', { withCredentials: true })
      .subscribe(
        (response) => console.log(response),
        (error) => console.error(error)
      );
  }

  isLoggedIn(): Promise<boolean | undefined> {
    return firstValueFrom(
      this.http
        .get('http://localhost:8080/api/me', { withCredentials: true })
        .pipe(
          map(() => {
            this.cachedIsLoggedIn = true;
            return true;
          }),
          catchError(() => {
            this.cachedIsLoggedIn = false;
            return of(false);
          })
        )
    );
  }

  async getLevels(): Promise<Array<GameLevel>> {
    return firstValueFrom(
      this.http
        .get<any>('http://localhost:8080/api/levels', { withCredentials: true })
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
    );
  }

  getLevel(id: number): Observable<GameLevel> {
    return this.http
      .get<any>(`http://localhost:8080/api/levels/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((level) => ({
          id: level.ID,
          name: level.Name,
          hint: level.Hint,
          rows: level.Rows,
          columns: level.Columns,
          startingBalls: level.StartingBalls,
          endingBalls: level.EndingBalls,
          map: level.MapData,
        }))
      );
  }

  async getAuthenticatedPlayer(): Promise<Player> {
    try {
      const playerData: any = await this.http
        .get<any>(`http://localhost:8080/api/player`, {
          withCredentials: true,
        })
        .pipe(map((result) => result))
        .toPromise();

      return {
        id: playerData.ID,
        name: playerData.Name,
        levelStatuses: playerData.LevelStatuses.map((levelStatus: any) => ({
          levelId: levelStatus.LevelID,
          attempts: levelStatus.Attempts,
          failures: levelStatus.Failures,
          completed: levelStatus.Completed,
        })),
      };
    } catch (error) {
      console.error(`Error getting player: ${JSON.stringify(error)}`);

      return new Player();
    }
  }

  async getPlayer(id: number): Promise<Player> {
    try {
      const playerData: any = await this.http
        .get<any>(`http://localhost:8080/api/player/${id}`, {
          withCredentials: true,
        })
        .pipe(map((result) => result))
        .toPromise();

      return {
        id: playerData.ID,
        name: playerData.Name,
        levelStatuses: playerData.LevelStatuses.map((levelStatus: any) => ({
          levelId: levelStatus.LevelID,
          attempts: levelStatus.Attempts,
          failures: levelStatus.Failures,
          completed: levelStatus.Completed,
        })),
      };
    } catch (error) {
      console.error(`Error getting player: ${JSON.stringify(error)}`);

      return new Player();
    }
  }

  savePlayer(player: Player) {
    return this.http
      .put(`http://localhost:8080/api/player/${player.id}`, player, {
        withCredentials: true,
      })
      .subscribe();
  }

  handleError(error: any) {
    console.log('oops');
  }

  setPostLoginRedirect(url: string) {
    this.postLoginUrl = url;
  }

  getPostLoginRedirect(): string {
    return this.postLoginUrl;
  }

  async saveMap(level: GameLevel) {
    if (level.id === -1) {
      const newLevel = { ...convertToDatabaseLevel(level), ID: 0 };
      await this.http
        .post(`http://localhost:8080/api/levels`, newLevel, {
          withCredentials: true,
        })
        .toPromise();
    } else {
      await this.http
        .put(
          `http://localhost:8080/api/levels/${level.id}`,
          convertToDatabaseLevel(level),
          {
            withCredentials: true,
          }
        )
        .toPromise();
    }
    return;
  }
}
