import { Component, ElementRef, Input, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-launch-button',
  templateUrl: './launch-button.component.html',
  styleUrls: ['./launch-button.component.css'],
})
export class LaunchButtonsComponent implements AfterContentInit {
  @Input() launchFunction: Function = () => {};
  @Input() index: number = 0;

  constructor(private elRef: ElementRef) {}

  ngAfterContentInit(): void {
    this.elRef.nativeElement.style.setProperty('left', `${this.index * 100}px`);
  }

  doLaunchFunction() {
    if (this.launchFunction) {
      this.launchFunction(this.index);
    }
  }
}
