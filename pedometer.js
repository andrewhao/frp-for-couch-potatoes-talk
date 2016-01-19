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

let currentState = mouseMoveStream.scan((acc, currentValue) => {
  return currentValue;
}, {x: 0, y: 0})

currentState.subscribe(newState => {
  $('.raw-output').html(`<div>x: ${newState.x}, y:${newState.y}</div>`);
});
