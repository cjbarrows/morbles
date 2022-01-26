import { Component } from '@angular/core';

import { RendererService } from './renderer.service';
import { PhysicsService } from './physics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular Pachinko';

  timer: any;
  running = false;

  TIME_PER_FRAME = 33;

  constructor(
    private physics: PhysicsService,
    private renderer: RendererService
  ) {
    this.renderer.createDrawlistFromPhysics(this.physics);

    this.startClock();
  }

  startClock() {
    this.running = true;
    this.runClock();
  }

  stopClock() {
    this.running = false;
  }

  runClock() {
    this.timer = setTimeout(() => {
      this.tick();
    }, this.TIME_PER_FRAME);
  }

  tick() {
    this.physics.tick();
    this.renderer.createDrawlistFromPhysics(this.physics);

    if (this.running) {
      this.runClock();
    }
  }

  onNotifyTimer(startTimer: boolean) {
    if (startTimer) {
      this.startClock();
    } else {
      this.stopClock();
    }
  }

  onNotifyLoad() {
    this.physics.clearAll();

    this.physics.addBumper(400, 100);
  }

  getRenderer(): RendererService {
    return this.renderer;
  }
}
