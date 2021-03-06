import { animation, style, animate, keyframes } from '@angular/animations';

export const dropInAnimation = animation([
  style({
    top: '25px',
    left: '{{ leftStart }}',
  }),
  animate(
    '.5s ease-in',
    keyframes([
      style({ left: '{{ leftStart }}', offset: 0 }),
      style({ left: '{{ leftStop }}', offset: 0.4 }),
      style({ top: '50px', offset: 1 }),
    ])
  ),
]);
