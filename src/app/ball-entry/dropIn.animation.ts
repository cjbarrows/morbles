import { animation, style, animate, keyframes } from '@angular/animations';

export const dropInAnimation = animation([
  style({
    top: '25px',
    left: '{{ leftStart }}',
  }),
  animate(
    '1s',
    keyframes([
      style({ left: '{{ leftStart }}', offset: 0 }),
      style({ left: '{{ leftStop }}', offset: 0.7 }),
      style({ top: '50px', offset: 1 }),
    ])
  ),
]);
