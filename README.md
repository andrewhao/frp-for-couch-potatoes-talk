Reactive Programming for Couch Potatoes
---------------------------------------

You've heard the yapping about functional reactive programming and how it's the bee's knees.
But... you can't figure out how it works, and all the math-talk and theory jargon that comes up on [Wikipedia](https://en.wikipedia.org/wiki/Functional_reactive_programming) is confusing to you.

Fear not! Together, we'll go through the concepts of streams, functions, and data flow.
We'll take the concepts apart with diagrams and explain them in plain English.

With this newfound knowledge, we'll build ourselves a pedometer (step counter) with
an HTML5 device accelerometer, RxJS (a Javascript FRP library), some math and maybe physics (gulp).

We'll even talk a little bit about how these concepts apply to real
world frameworks like Redux, Cycle.js and Elm.

In the end, you'll not only
get up to speed about reactive programming, you'll be able to have new insights and tools
to implement reactive principles in your next project.

### Slides:

[<img src="http://i.imgur.com/11PUQDd.png" width=50% />](http://www.g9labs.com/frp-for-couch-potatoes-talk/)

http://www.g9labs.com/frp-for-couch-potatoes-talk/

### Demo:

http://www.g9labs.com/quickcadence

### Source:

Cadence counter: https://github.com/andrewhao/quickcadence

Cycle.js test data harness: https://github.com/andrewhao/quickcadence/blob/master/reference/js/RxJSRunner.js

### Pebble app:

[<img src="http://i.imgur.com/0A9Dx4x.png" width=30% />](https://apps.getpebble.com/en_US/application/5637f7b277a1ea0c45000009)

https://apps.getpebble.com/en_US/application/5637f7b277a1ea0c45000009

## Further reading:

* "The Introduction to Reactive Programming You've Been Missing": https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
* "OMG Streams!": https://www.youtube.com/watch?v=3iKkwzlch0o
* http://cycle.js.org/observables.html
* http://rxmarbles.com/
* http://reactivex.io/learnrx/
* https://medium.com/@codeandrop/es7-es2016-generators-observables-oh-my-ba07925f7a80#.z6h47c59n
* https://github.com/Reactive-Extensions/RxJS/tree/master/doc/designguidelines
* https://medium.com/@garychambers108/functional-reactive-react-js-b04a8d97a540#.t88xytrdo

## Pedometer algorithms

* https://github.com/andrewhao/quickcadence
* https://github.com/bagilevi/android-pedometer
* http://sebastien.menigot.free.fr/index.php?option=com_content&view=article&id=93:pedometer-in-html5-&catid=46:web-application-for-firefox-os&Itemid=82

## How to run this app and preso:

### To compile the app:

    $ cd pedometer
    $ npm install
    $ webpack-dev-server

Then open `http://localhost:8080/example1.html`
