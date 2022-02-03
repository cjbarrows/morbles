# AngularPachinko

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

## Todo

[ ] what to do about a ball already in a catcher with another ball on the way?
[ ] BUG: expanding the # of rows did not add to the physics cells
[ ] BUG: check proxy above-and-to-the-right of gate
[ ] codify entryParams
[ ] easy adjustment of graphics scaling?
[ ] add Angular UI controls/interactions (for learning)
[ ] add target chute(s)
[ ] add ball colors
[ ] add target ball order

## Done

[x] add buttons to drop balls in each chute
[x] draw circles using divs
[x] have start/stop buttons to continuously run the physics
    [x] the app component should control the physics engine timer, etc.
[x] collision detection with bumpers
[x] redoing with more "deterministic" physics
    [x] bumpers
    [x] draw cell boundaries
[x] change start/stop to bootstrap .custom-switch
[x] add bumpers
    [x] and draw them
    [x] make them clickable/reversible
[x] make cells handle balls coming in from different sides
    - "physicsMapping" class
[-] make bumpers pass-through for "unused" side
[x] make things clickable even while sim is running (related to re-render, below)
[x] only re-render if something has changed (Angular?)
[-] get ngOnChanges working again
    - I think it fires whenever the reference changes; so no big deal that it's not firing now
    - I'm a little unclear on why/how the DOM is being refreshed
    - but it seems to work nicely so I'll ignore that for now
      - I think the trackBy is helping a lot
[x] draw chutes
[x] line up launch buttons with gameboard chutes
[-] ngModel for game settings?
    - ngModel is cool but sounds like the Form method is preferred
[x] UI controls to set width/height/spacing
    [x] try out synchronous form validation
    [x] add Observable operators to intercept changes to a form control
[x] bumper left/right from UI
[x] make sure launch buttons are not in the way of the "game"
    - launch balls from -1?
[x] load from ASCII map in UI, into dynamic cell controls
[x] map should clear (or be truncated?) with dimension re-size
[x] constant for ball speed
[x] add catch-and-flippers (ie, "gates")

## Notes

- had to restart `ng serve` after adding ng-bootstrap

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
