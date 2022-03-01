import { animation, style, animate, keyframes } from '@angular/animations';

export const flareAnimation = animation([
  style({
    filter: 'brightness(1.0)',
    opacity: 1.0,
  }),
  animate(
    '2.0s',
    keyframes([
      style({ filter: 'brightness(20.0)', offset: 0 }),
      style({ filter: 'brightness(20.0)', offset: 0.5 }),
      style({ filter: 'brightness(1.0)', offset: 0.6 }),
    ])
  ),
]);
