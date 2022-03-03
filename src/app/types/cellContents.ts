import { ColorName } from '../ball';

export interface CellContents {
  ball: ColorName | null;
  cell: string;
}
