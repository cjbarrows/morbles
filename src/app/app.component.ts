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

  constructor(
    private physics: PhysicsService,
    private renderer: RendererService
  ) {
    this.renderer.drawFromPhysics(this.physics);
  }

  onNotify() {
    this.renderer.drawFromPhysics(this.physics);
  }

  getRenderer(): RendererService {
    return this.renderer;
  }
}
