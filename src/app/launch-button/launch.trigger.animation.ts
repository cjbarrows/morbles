import {
  state,
  style,
  trigger,
  transition,
  animate,
} from '@angular/animations';

export const launchTrigger = trigger('launch', [
  state(
    'on',
    style({
      opacity: 1.0,
      filter: 'brightness(1.0)',
      transform: 'translate(25px, 0) rotate(90deg) scale(1.0)',
    })
  ),
  state(
    'off',
    style({
      opacity: 0,
      filter: 'brightness(1.0)',
      transform: 'translate(25px, 0) rotate(90deg) scale(1.0)',
    })
  ),
  state(
    'flare',
    style({
      opacity: 1.0,
      filter: 'brightness(20.0)',
      transform: 'translate(25px, 0) rotate(90deg) scale(2.0)',
    })
  ),
  transition('* => on', [animate(1000)]),
  transition('on => off', [animate(1000)]),
  transition('* => flare', [animate(200)]),
  transition('flare => *', [animate(200)]),
]);
