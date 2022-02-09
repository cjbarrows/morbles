import {
  state,
  style,
  trigger,
  transition,
  useAnimation,
} from '@angular/animations';

import { dropOutAnimation } from './dropOut.animation';

export const dropOutTrigger = trigger('dropOut', [
  state(
    'new',
    style({
      top: '30px',
      left: '{{ leftStop }}',
    }),
    { params: { leftStop: '900px' } }
  ),
  transition('* => new', [useAnimation(dropOutAnimation)]),
]);
