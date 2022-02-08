import { animation, style, animate, keyframes } from '@angular/animations';

export const dropInAnimation = animation([
  style({
    top: '-25px',
    left: '{{ leftStart }}',
  }),
  animate(
    '1s',
    keyframes([
      style({ top: '-25px', offset: 0 }),
      style({ top: '30px', offset: 0.3 }),
      style({ left: '{{ leftStop }}', offset: 1 }),
    ])
  ),
]);
