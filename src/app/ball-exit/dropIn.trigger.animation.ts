import {
  animation,
  state,
  style,
  animate,
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
      filter: 'hue-rotate(50deg)',
      left: '{{ leftStop }}',
    }),
    { params: { leftStop: '900px' } }
  ),
  state(
    'old',
    style({
      top: '10px',
    })
  ),
  transition(
    '* => new',
    [
      useAnimation(
        dropInAnimation /*, {
        params: { leftStart: '75px', leftStop: '900px' },
      }*/
      ),
    ]
    // [animate('1s')]
  ),
  transition('old => new', [
    useAnimation(dropInAnimation, {
      params: { leftStart: '75px', leftStop: '900px' },
    }),
  ]),
  transition('new => old', [
    useAnimation(dropInAnimation, {
      params: { leftStart: '75px', leftStop: '900px' },
    }),
  ]),
]);
