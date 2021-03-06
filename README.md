# AngularPachinko

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

## Todo

    [ ] BUG: adjusting # of columns in editor, then switching Air to Bumper Left: it drops a blue ball (!)
    [ ] mark "official" levels in the navbar?
    [ ] BUG: changing # of columns in editor doesn't adjust map columns properly
    [ ] make it look nice on a phone
    [ ] REFACTOR: all shorthand / cell types from one source
    [ ] should it count as success if you still have balls left / balls in play?
    [ ] unsubscribe to map editor subscriptions
    [ ] BUG: the PUT player for completing a level is not updating in time for the GET (which still shows the level incomplete)
        - is this a Heroku-only bug, I forget?
    [ ] TECH DEBT: is my "cached login status" a problem if you get logged out via timeout?
    [ ] cache some of the server queries on the client-side
    [ ] BUG: if map doesn't have enough cells, mapForm still shows "air" in missing cells but they aren't loaded into physics
    [ ] REFACTOR: move colorName to constants
    [ ] REFACTOR: reconcile app / gameboard responsibility (start/stop, time, ball order, etc)
    [ ] REFACTOR: put # rows/cols on mapeditor?
        - or move controls component to map editor?
    [ ] BUG: expanding the # of rows did not add to the physics cells
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
    [x] add level choosing screen
    [x] add routing to the app
    [x] don't have level control buttons needing to be refreshed each tick
    [x] add level picker above game board
    [x] save player progress to server
    [x] update levels immediately after game state changes
    [x] player stats screen
    [x] mark an attempt as soon as 1 ball is released
    [x] redirect to original, desired page after login
    [x] "preventing unauthorized access" to routes
    [x] have / redirect to /login or /levels depending on login status
    [x] BUG: level 4, first ball, marks "failed" attempt
        - I don't like the "fail on first of 2 balls" problem
    [x] count failures and show level button in red for any level with a "failure"
        - ie, not just started but definitely *failed*
    [x] make editor route
    [x] save map editor levels to server
    [x] make editor route for loading existing level
    [x] REFACTOR: map-editor.component.ts ngOnChanges
    [x] adjust height of gameboard to match # of rows
    [x] center game and make it not-quite-so-wide
    [x] UI for logout
    [x] UI for login
        [x] don't show login navbar on login screen
    [x] UI for starting to edit a level
        [x] with guard
            - for now: hard-coded to my email address upon player registration
    [x] UI for starting a new level
    [x] refresh player(s) after adding & saving a new level
        - refreshed player on server -- that seemed to work for now
    [-] auto-load levels from /index
    [x] auto-load levels from db
    [x] display toast for login failure
    [x] make better launch buttons
        [x] play flash animation when button is clicked
        [x] turn off launch buttons when all balls are gone
    [x] show level hint at start
        [x] maybe with "play" button and no launch buttons until play starts
    [x] BUG: the level completion red/green buttons are not always showing correctly (!)
        - mostly when clicking among levels
        - I think it was because the LevelStatuses were coming back un-sorted
    [x] handle "next level not found" error when you've reached the end
        - new "success" dialog message?
    [x] fancier "level complete" or "level failed" message
    [x] BUG: slight flicker when ball drops in from top
        - I think this could be a short interim where it's not rendered at all (ie, in between the drop-in and the game board)
          - yeah, seems like it; need a good way to fix that
    [-] GAMEPLAY: should a ball landing on top of a ball in a gate act differently?
        - right now it's the same effect as a ball flipping the gate
            - I think that may be "right" from a physics point of view...
    [x] create method in editor to place balls
        - I used a lowercase color letter after the space in the map
    [x] don't show "you've won it all" if there are some incomplete levels
    [x] BUG: don't show the "level complete" dialog until the last ball is finished animating
    [x] BUG: don't show the end modals if one is already showing
    [x] BUG: need to check for Game Over if ball goes out of bounds (ie, doesn't animate off)
    [x] should "go on to the next level" go on to the next *uncompleted* level?
    [x] fail game as soon as any wrongly-colored ball arrives
    [x] BUG: the out-of-bounds checking is missing again
        - UNIT TESTS(!)
    [x] BUG: click level 4, click X, click level 5, fail, click play = messed up level 4 (?!)
        - seems like some of the subscriptions are hanging around
            - yeah, seemed like it; I wonder how hard those would be to unit test (!) (ie, would require multiple attempts in a row)
    [x] BUG: attempts is still mis-counting
         - for out-of-bounds balls at least
         - might be 2 updatePlayerStatus function calls, one in app.component and one in game-board :/
         - or could be a subscription problem:
            - it seemed to be happening for levels that weren't even the current level (ie, one that had been "canceled")
            - I think it was the "count an attempt once it's 'in progress'" logic
                - I changed it to start a level in "open" (ie, not "in progress")
                    - that might affect some animations but seems better for scoring
    [ ] BUG: gate on right-hand "lane" exits ball improperly (!)
        - couldn't reproduce this
    [x] BUG: bumper to gate (on same Y-axis): what should happen?
        - should act the same as a ball coming in
            [x] coming in from "handoff side" needs to not start the ball "animation" from the top
        - and if there's a ball in the cradle already, bump it out
        [x] need conditionalBallExit to happen at different frames depending on the cell-to-cell combinations
            - I didn't end up doing that but I did check for flipped
              - kinda hacky; certainly inelegant, but ok
        [x] toggle bit?
            - I used vectr.com to do some vector drawing last time
            [x] need to handle balls coming down the "right lane" of the toggle
    [x] BUG: Toggle on a new map didn't save
    [x] TECH DEBT: replace GateHandoff and PhysicsMapping for Air => Gate
        - um, that was easy
            [x] oops, except the Bumper => Gate interaction needs to be fixed (again)
              [x] and now the 2nd ball into a gate (from a mapping) needs to be fixed
                  [x] I think a ball coming from a bumper should knock the first ball out...
                      [x] try making a new animation system for the balls
                      [x] and get rid of .proxy and Bumper => Air => Gate handoffs
                      [x] and fix toggle in the same way
                          - transition from Bumper to Toggle isn't smooth atm
    [x] additional game components? steal from that programming game (Turing Tumble)?
        [x] stopper/catcher
    [x] BUG: ball shouldn't show up beyond right-most column
    [ ] BUG: you shouldn't be able to "uncomplete" a level
        - is this still a bug? I don't think so
    [ ] REFACTOR: gate "curves" into keyframe animations
        - maybe use Angular animations?
    [ ] also add 'gate handoff' when 'gate' is added to map
    [ ] BUG: check proxy above-and-to-the-right of gate
    [x] BUG: level editor seems broken
        [x] needs to account for cell width
        [x] needs to account for a ball in a cell
        [x] expanding the # of columns should pad with air, not shift cells
        [-] ability to swap cells right/left
            - nah
        [x] don't let cells be added where they don't fit
            [x] a gate on the right-most edge
                - don't forget to use trackBy to stop *ngFor from perpetually reloading
            [-] or add a gate next to something non-air
                - seems fine to let toggles & gates "eat" a bumper, etc.
        [x] show playable map as it's being edited
        [x] don't show game modals during editing
        [x] restart command for editor
        [x] game state indicator for editor
        [x] toggling gates, bumpers, and toggles with mouse click is allowed in editor mode
            - used a static boolean on the GameCell class, but not sure why/when it gets "reset" to its initial value -- but it seems to on page refresh, which is fine
            [x] and it counts as a map change
    [x] BUG: stopper hides rows below it
        - render bottom to top?
            - by game cell y
        [x] gate is being drawn behind stopper too
    [x] create "official" levels
    [x] allow "un-official" levels (that aren't part of the automatic progression)
    [x] clean up the level editor so it looks nice
    [x] BUG: getting a 401 Unauthorized from /api/me on Heroku
        - getting the same error when I point my local client to the Heroku app
        - not sure why it stopped working on Heroku; I changed to SameSite and Secure and it started working again
            - might have to consider putting everything on one server if it keeps giving me trouble

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
