# AngularPachinko

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

## Todo

[ ] add level choosing screen
[ ] add routing to the app
[ ] save levels to server
[ ] don't have level control buttons needing to be refreshed each tick
[ ] BUG: level 4, first ball, marks "failed" attempt
[ ] BUG: gate on right-hand "lane" exits ball improperly (!)
[ ] BUG: slight flicker when ball drops in from top
[ ] BUG: bumper to gate (on same Y-axis): what should happen?
[ ] show level hint at start
[ ] BUG: if map doesn't have enough cells, mapForm still shows "air" in missing cells but they aren't loaded into physics
[ ] auto-load levels from /index
[ ] auto-load levels from db
[ ] REFACTOR: map-editor.component.ts ngOnChanges
[ ] also add 'gate handoff' when 'gate' is added to map
[ ] REFACTOR: move colorName to constants
[ ] REFACTOR: reconcile app / gameboard responsibility (start/stop, time, ball order, etc)
[ ] REFACTOR: put # rows/cols on mapeditor?
    - or move controls component to map editor?
[ ] REFACTOR: gate "curves" into keyframe animations
    - maybe use Angular animations?
[ ] BUG: expanding the # of rows did not add to the physics cells
[ ] BUG: check proxy above-and-to-the-right of gate
[ ] REFACTOR: codify entryParams
[ ] easy adjustment of graphics scaling?
[ ] add Angular UI controls/interactions (for learning)

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
[x] oops, the ball is supposed to go straight down off the gate
    - and a second ball flips the gate back
[-] add target chute(s)
[x] add ball colors
[x] what to do about a ball already in a catcher with another ball on the way?
    [x] second ball should hop over and trigger the gate
[x] add incoming ball stream from text field
[x] add target ball order from text field
[-] add ramp so one ball off the gate can "pass" another
    - the gate seems to work for this
[x] buttons to load levels
[-] retry button
    - just re-click level-loading button
[x] make any ball that goes out-of-bounds *not* count
    - doesn't fail the level instantly in case we *want* some balls to go out of bounds
[x] get game states working
[x] player object (to track level completion, etc)
[x] button status for level completion
[x] animation for ball exit
[x] BUG: red inbounds, green out-of-bounds: didn't fail level
[x] animation for ball drop
[x] BUG: ball entry ballEntryInfo count of items should not change during gameplay
[x] make sure 2 balls can't be in the entry chute at once (or fix it so they can...)
[x] show target balls in transparent colors at finish
[x] load player from service
[x] save player to server
[x] add front-end login route and server route

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
