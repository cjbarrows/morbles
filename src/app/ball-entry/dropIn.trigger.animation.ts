import {
  state,
  style,
  trigger,
  transition,
  useAnimation,
} from '@angular/animations';

import { dropInAnimation } from './dropIn.animation';

export const dropInTrigger = trigger('dropIn', [
  state(
    'drop',
    style({
      top: '25px',
      left: '{{ leftStop }}',
      display: 'none',
    }),
    { params: { leftStop: '900px' } }
  ),
  transition('* => drop', [useAnimation(dropInAnimation)]),
]);
