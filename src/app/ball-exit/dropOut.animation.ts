import { animation, style, animate, keyframes } from '@angular/animations';

export const dropOutAnimation = animation([
  style({
    top: '-25px',
    left: '{{ leftStart }}',
  }),
  animate(
    '.5s ease-out',
    keyframes([
      style({ top: '-25px', offset: 0 }),
      style({ top: '30px', offset: 0.3 }),
      style({ left: '{{ leftStop }}', offset: 1 }),
    ])
  ),
]);
