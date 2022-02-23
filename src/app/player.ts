import { LevelStatus } from './levelStatus';

export class Player {
  id: number;
  name: string;
  levelStatuses: Array<LevelStatus>;
  admin: boolean;

  constructor(id: number = -1, name: string = '') {
    this.id = id;
    this.name = name;
    this.levelStatuses = [];
    this.admin = false;
  }
}
