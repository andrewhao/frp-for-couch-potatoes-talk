import Rx from 'rx';
import $ from 'jquery';

let mouseMoveStream = Rx.Observable.fromEvent(document, 'mousemove')
  .map(evt => ({x: evt.pageX, y: evt.pageY}))

let initialState = {lastCoordinate: {x: 0, y: 0}, direction: '?'};
let currentState = mouseMoveStream.scan((oldState, newCoordinate) => {
  let newDirection = oldState.lastCoordinate.y < newCoordinate.y ? 'down' :
'up';
  return {lastCoordinate: newCoordinate, direction: newDirection};
}, initialState)

currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
});
