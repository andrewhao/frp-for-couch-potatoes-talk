import Rx from 'rx';
import $ from 'jquery';

//if (window.DeviceMotionEvent) { document.write("device motion supported") }

window.addEventListener('devicemotion', (e) => {
  //$('body').prepend('<div>New motion' + e.acceleration.x + "," + e.acceleration.y + '</div>');
}, false)

let mouseMoveStream = Rx.Observable.fromEvent(document, 'mousemove')
  .map(evt => {
    return { x: evt.pageX, y: evt.pageY }
  })

let initialState = {lastCoordinate: {x: 0, y: 0}, direction: '?'};
let currentState = mouseMoveStream.scan((oldState, newCoordinate) => {
  let newDirection = oldState.lastCoordinate.y < newCoordinate.y ? 'down' :
'up';
  return {lastCoordinate: newCoordinate, direction: newDirection};
}, initialState)

currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
});
