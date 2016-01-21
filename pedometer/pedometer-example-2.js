import Rx from 'rx';
import $ from 'jquery';

// -------------------------------------------------
// 1) Transform inputs
// -------------------------------------------------
let mouseMoveStream = Rx.Observable.fromEvent(document, 'mousemove')
  .map(evt => ({x: evt.pageX, y: evt.pageY}))

// Return false if mouse is moving upwards on the screen,
// false if downwards.
//       mouseMoveStream: --[e]--[e]--[e]--[e]--[e]-->
//       directionStream: --[u]--[u]--[d]--[u]--[d]-->
let directionStream = mouseMoveStream
  .pairwise()
  .map(pair => {
    let [firstCoord, lastCoord] = pair
    return ((lastCoord.y - firstCoord.y) > 0) ? 'down' : 'up'
  })

//       directionStream: --[u]--[u]--[d]--[u]--[d]-->
// directionChangeStream: --[u]-------[d]--[u]--[d]-->
let directionChangeStream = directionStream
  .distinctUntilChanged()

// directionChangeStream: --[u]-------[d]--[u]--[d]-->
//       stepTakenStream: ------------[s]-------[s]-->
let stepTakenStream = directionChangeStream
  .scan((acc, dir) => acc + 1, 0)
  .filter(count => (count % 2) == 0)
  .map('step!')

//       stepTakenStream: ------------[s]-------[s]-->
// directionChangeStream: --[u]-------[d]--[u]--[d]-->
//   combinedEventStream: --[u]-------[s][d][u][s][d]->
let combinedEventStream = Rx.Observable.merge(
  stepTakenStream,
  directionChangeStream
)

// -------------------------------------------------
// 2) Update state
// -------------------------------------------------
let initialState = {stepCount: 0, direction: '?'};
let currentState = combinedEventStream.scan((oldState, event) => {
  let newStepCount = oldState.stepCount;
  let newDirection = oldState.direction;
  if (event == 'step!') {
    newStepCount = oldState.stepCount + 1;
  } else if (event == 'up' || event == 'down') {
    newDirection = event
  }
  return {stepCount: newStepCount, direction: newDirection};
}, initialState)

// -------------------------------------------------
// 3) Update UI, perform side effects
// -------------------------------------------------
currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
  $('.step-output').text(`Step counter is: ${newState.stepCount}`);
});
