const gravity: number = 0.25;
const drag: number = 0.95;
const BALL_SPEED: number = 6;
type GAME_STATE = 'unstarted' | 'in progress' | 'success' | 'failed';

export { BALL_SPEED, drag, GAME_STATE, gravity };
