import { LevelStatus } from './levelStatus';

export class Player {
  name: string;
  levelStatuses: Array<LevelStatus>;

  constructor(name: string) {
    this.name = name;
    this.levelStatuses = [];
  }
}
