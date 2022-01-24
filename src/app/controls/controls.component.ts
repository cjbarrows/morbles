import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { PhysicsService } from '../physics.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent implements OnInit {
  @Output() notify = new EventEmitter();

  constructor(private physics: PhysicsService) {}

  ngOnInit(): void {}

  doTick() {
    this.physics.tick();
    this.notify.emit();
  }
}
