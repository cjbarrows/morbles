export interface LevelStatus {
  levelId: number;
  attempts: number;
  failures: number;
  completed: boolean;
  isOfficial: boolean;
}
