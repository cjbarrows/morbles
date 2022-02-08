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
    'new',
    style({
      top: '30px',
      left: '{{ leftStop }}',
    }),
    { params: { leftStop: '900px' } }
  ),
  transition('* => new', [useAnimation(dropInAnimation)]),
]);
