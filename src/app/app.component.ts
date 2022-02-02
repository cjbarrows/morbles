import { Component } from '@angular/core';

import { RendererService } from './renderer.service';
import { PhysicsService } from './physics.service';
import { getCellFromName } from './cellFactory';
import { Size } from './size';
import { convertShorthandMap } from './utilities/convertShorthand';

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

  startMap: Array<string> = [];

  constructor(
    public physics: PhysicsService,
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

  onNotifyExamine() {
    console.log(this.renderer.getDrawlist());
  }

  onNotifyLoad() {
    const shorthandMap = 'AAAAAAAA' + 'AAARRAAA' + 'AARAALAA' + 'AAAAAAAA';
    this.startMap = convertShorthandMap(shorthandMap);

    /*
    this.physics.clearAll();

    this.physics.addCell(3, 0, new Air());
    this.physics.addCell(4, 0, new Air());
    this.physics.addCell(5, 0, new Air());

    this.physics.addCell(3, 1, new Air());
    this.physics.addCell(4, 1, new Air());
    this.physics.addCell(5, 1, new Air());

    this.physics.addCell(3, 2, new Bumper());
    this.physics.addCell(4, 2, new Bumper());
    this.physics.addCell(5, 2, new Air());
    // this.physics.addCell(5, 2, new Bumper());

    this.physics.addCell(2, 3, new Air());
    this.physics.addCell(3, 3, new Air());
    this.physics.addCell(4, 3, new Air());
    this.physics.addCell(5, 3, new Air());
    this.physics.addCell(6, 3, new Air());

    this.physics.addCell(2, 4, new Air());
    this.physics.addCell(3, 4, new Air());
    this.physics.addCell(4, 4, new Air());
    this.physics.addCell(5, 4, new Air());
    this.physics.addCell(6, 4, new Air());

    this.physics.addCell(9, 0, new Air());
    this.physics.addCell(9, 1, new Air());
    */
  }

  onNotifySize(size: Size) {
    this.physics.setNumColumns(size.columns);
    this.physics.rows = size.rows;
  }

  onNotifyLoadMap(mapCells: Array<string>) {
    this.physics.clearAll();

    mapCells.forEach((name, index) => {
      const cell = getCellFromName(name);

      const x = index % this.physics.getNumColumns();
      const y = (index - x) / this.physics.getNumColumns();
      this.physics.addCell(x, y, cell);
    });
  }

  onNotifyCellChange(cellChange: any) {
    const x: number = cellChange.cellIndex % this.physics.getNumColumns();
    const y: number = (cellChange.cellIndex - x) / this.physics.getNumColumns();

    const cell = getCellFromName(cellChange.value);

    this.physics.setCell(x, y, cell);
  }

  getRenderer(): RendererService {
    return this.renderer;
  }
}
