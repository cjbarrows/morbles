const gravity: number = 0.25;
const drag: number = 0.95;
const BALL_SPEED: number = 6;
type GAME_STATE = 'unstarted' | 'in progress' | 'success' | 'failed';
const CELL_WIDTH = 100;

export { BALL_SPEED, CELL_WIDTH, drag, GAME_STATE, gravity };
