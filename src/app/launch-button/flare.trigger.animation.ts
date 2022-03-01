import {
  state,
  style,
  trigger,
  transition,
  useAnimation,
} from '@angular/animations';

import { flareAnimation } from './flare.animation';

export const flareTrigger = trigger('flareTrigger', [
  state('flare', style({})),
  transition('* => flare', [useAnimation(flareAnimation)]),
]);
