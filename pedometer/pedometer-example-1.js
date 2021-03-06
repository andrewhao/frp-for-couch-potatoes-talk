import Rx from 'rx';
import $ from 'jquery';

// -------------------------------------------------
// 1) Transform inputs
// -------------------------------------------------
let mouseMoveStream = Rx.Observable.fromEvent(document, 'mousemove')
  .map(evt => ({x: evt.pageX, y: evt.pageY}))

// -------------------------------------------------
// 2) Update state
// -------------------------------------------------
let initialState = {lastCoordinate: {x: 0, y: 0}, direction: '?'};
let currentState = mouseMoveStream.scan((oldState, newCoordinate) => {
  let newDirection = oldState.lastCoordinate.y < newCoordinate.y ? 'down' :
'up';
  return {lastCoordinate: newCoordinate, direction: newDirection};
}, initialState)

// -------------------------------------------------
// 3) Update UI, perform side effects
// -------------------------------------------------
currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
});
