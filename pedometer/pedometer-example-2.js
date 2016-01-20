import Rx from 'rx';
import $ from 'jquery';

let mouseMoveStream = Rx.Observable.fromEvent(document, 'mousemove')
  .map(evt => ({x: evt.pageX, y: evt.pageY}))

let deltaYStream = mouseMoveStream
  .pairwise()
  .map(coordinatePair => {
    let [coord1, coord2] = coordinatePair
    return (coord2.y - coord1.y) > 0
  })

let directionStream = deltaYStream
  .pairwise()
  .filter(pairs => {
    let [delta1, delta2] = pairs
    return delta1 != delta2
  })
  .map(directionPairs => {
    let [first, last] = directionPairs
    return (first === true && last === false) ? 'up' : 'down'
  });

let stepIncrementStream = directionStream.scan((acc, dir) => acc + 1, 0)
  .map(count => (count % 2))

let combinedStream = Rx.Observable.combineLatest(
  directionStream,
  stepIncrementStream,
  (direction, increment) => {
    return { direction: direction, increment: increment }
  }
).tap(v => console.log(v))

let initialState = {direction: '?', stepCount: 0};
let currentState = combinedStream.scan((oldState, event) => {
  let newStepCount = oldState.stepCount + event.increment;
  return {direction: event.direction, stepCount: newStepCount};
}, initialState)

currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
  $('.step-output').text(`Step counter is: ${newState.stepCount}`);
});
