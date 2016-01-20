import Rx from 'rx';
import $ from 'jquery';

let mouseMoveStream = Rx.Observable.fromEvent(document, 'mousemove')
  .map(evt => ({x: evt.pageX, y: evt.pageY}))

let mouseVelocityStream = mouseMoveStream
  .timestamp()
  .pairwise()
  .map((coordinatePair) => {
    let [first, last] = coordinatePair;
    let deltaTime = (last.timestamp - first.timestamp) / 1000;
    let deltaY = last.value.y - first.value.y;
    return deltaY / deltaTime;
  })

mouseVelocityStream.subscribe(velocity => {
  $('.velocity-output').text(`Mouse velocity is: ${velocity} pixels/s`);
});

let mouseAccelStream = mouseVelocityStream
  .timestamp()
  .pairwise()
  .map((coordinatePair) => {
    let [first, last] = coordinatePair;
    let deltaTime = (last.timestamp - first.timestamp) / 1000;
    let deltaVelocity = last.value - first.value;
    return deltaVelocity / deltaTime;
  })

mouseAccelStream.subscribe(acceleration => {
  $('.acceleration-output').text(`Mouse acceleration is: ${acceleration} pixels/s^2`);
});

let accelDirectionChangeStream = mouseAccelStream
  .pairwise()
	.map(values => {
		let [first, last] = values;
		return last - first
	})
	.subscribe(v => console.log(`changed? ${v}`))
	//.map(diff => diff > 0 ? '+' : '-')

let initialState = {lastCoordinate: {x: 0, y: 0}, direction: '?'};
let currentState = mouseMoveStream.scan((oldState, newCoordinate) => {
  let newDirection = oldState.lastCoordinate.y < newCoordinate.y ? 'down' :
'up';
  return {lastCoordinate: newCoordinate, direction: newDirection};
}, initialState)

currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
});
