import Rx from 'rx';
import $ from 'jquery';

if (window.DeviceMotionEvent) { document.write("device motion supported") }

window.addEventListener('devicemotion', (e) => {
  $('body').prepend('<div>New motion' + e.acceleration.x + "," + e.acceleration.y + '</div>');
}, false)

$(window).on('mousemove', e => {
  document.write("mouse moved");
  console.log(e.pageX, e.pageY);
});
