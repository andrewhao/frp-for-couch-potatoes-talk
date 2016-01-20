Reactive Programming for Couch Potatoes
---------------------------------------

## Abstract

You've heard the yapping about functional reactive programming and how it's the bee's knees.
But... you can't figure out how it works, and all the math-talk and theory jargon that comes up on [Wikipedia](https://en.wikipedia.org/wiki/Functional_reactive_programming) is confusing to you.

Fear not! Together, we'll go through the concepts of streams, functions, and data flow.
We'll take the concepts apart with diagrams and explain them in plain English.

With this newfound knowledge, we'll build ourselves a pedometer (step counter) with
an HTML5 device accelerometer, Bacon.js (a Javascript FRP library), some gumption, and basic math.

We'll even talk a little bit about how these concepts apply to real
world frameworks like React, Flux, and Elm. In the end, you'll not only
get up to speed about reactive programming, you'll be able to have new insights and tools
to implement reactive principles in your next project.

## Outline

Hi! I'm Andrew. Friendly programmer at Carbon Five. Tonight we will be
learning about Functional Reactive Programming principles, and applying
them tonight with HTML5 device sensor APIs, RxJS, and some good ol'
ingenuity.

### We will be looking at FRP through the lens of Javascript

I'm choosing Javascript because it's how I first encountered Rx and
streams. And my guess is that you're pretty familiar with Javascript
too. We can look at other frameworks and languages later.

### Streams are your friends

You'll want to sit down and get comfortable here.

What is a stream? A stream is like a pipe. No, not a fancy UNIX pipe.
Like a plumbing pipe. Like you're trying to hook up a faucet to the
water main, kind of pipe.

[Image of pipe, water]

[Potential Mario / pipe gag]

Where have you seen streams before? A WebSocket. Anything in Node that
opens a file, or starts a web request (I mean, heck it's called a
`stream` after all.)

You might also think about it like having an Array that you never get to
peek the entireity of, because it may potentially be infinite.

(Stock price of AAPL) [1, 5, 10, 11, 22, ?...]

### If you can build it with Events, you can model it as a stream.

Anything you've been doing with Events could also be thought of as a
stream.

For example, you might think about the position of a mouse cursor on a
screen as a stream. You have probably doing something like this:

```js
$(window).on('mousemove', function(e) {
  console.log(e.target.x, e.target.y);
  // do something with this new movement.
});
```

But what if you thought about it like a pipe? Like you were holding onto
a pipe of mousemove events coming through. It would look like:

```js
mouseMoveStream = [{x: 0, y: 0},       {x: 1, y: 122}, {x: 155, y: 23}, THE FUTURE...]
```

In fact, lots of other things in your software that, previously modeled
as events (either explicitly, or as domain events), could be considered streams:

- submittedForm -> formSubmitStream
- publishedNewsFeed -> newsFeedPublishStream

### Name change! Streams are, more generically, Observables.

OK, I promise I'll never do this to you again, but this name change is
going to help. Streams are also termed Observables in Rx-land because
they are like Arrays (or more generically, Sequences) that continuously
grow over time, and their changing value sequences are, well, observable.

### Why else is this important? There are things already called Observables out there!

RxJs has an Observable interface. We shall use this. Anything in the
ReactiveX family implements an Observable interface.

Bacon.js and Kefir.js also implement Observables.

ES7 ships with Observables (it's the FUTURE).

### F is for Functional.

Let's recap: a function is a relationship between a set of inputs and a
set of outputs.

```js
y = f(x)
where f(x) -> x + 4

x: 1 y: 5
x: 2 y: 6
x: 3 y: 7
```

```js
f(x) -> x < 10

x: 1  y: true
x: 11 y: false
```

The F in FRP relates to the fact that we are going to be using functions
as first class citizens to model dataflow.

### Your function(al) toolbelt

Now that we have streams of things, let's get to some things you can do with them.

You may be familiar with the toolbelt of transformation functions
available to programmers today.

(See: RxMarbles examples)

* `map()`

```js
var data = [1, 2, -100];
data.map(function(datum) { return datum > 0 });
// => [true, true, false]
```

* `reduce()`

Perform some sort of aggregate operation on a set of values, iteratively
returning the result of the last run.

```js
var data = [1, 2, -100];
data.reduce(function(previousValue, currentValue) {
  return previousValue + currentValue;
}, 0)

// => -97
```

* `filter()`

Only accepts values for which criteria returns true.

```js
var data = [1, 2, -100];
data.filter(function(v) { return v > 0; });

// => [1, 2]
```

### Now let's think of these functions in the context of streams.

I'm going to introduce a new way of seeing code. We're going to take a
timeline of values that pop into existence asynchronously. Meaning,
you're looking at a potentially unbounded array of size infinity, but
you don't know how long the stream will continue to emit data, or whence
it will fire. All you know is how to hook up your stream to react to the
next thing coming down the pipe.

Let's go back and look at our `map` example, but this time, `data` will
be `dataStream`, some sampling of data that is generated asynchronously.
Maybe it's from a file, maybe it's from a websocket.

```js
let dataStream = getAsyncDataStream()
let outputStream = dataStream.map((datum) => datum > 0);
```

Now, when a value pops into existence on the `dataStream`, the `outputStream`
will also produce a new value:

```js
data   |-- [1] -- [2] -- [-100] -->
output |-- [t] -- [t] --    [f] -->
```

Imagine this sort of thing could also happen with filter:

```js
let outputStream = dataStream.filter((v) => v > 0);

data   |-- [1] -- [2] -- [-100] -->
output |-- [1] -- [2] ------------>
```

Magic.

Now there *is* a `reduce` equivalent in streams, but it's probably not
what you're looking for. You are probably looking for something like
`scan`, which is like a partial-reduce.

* `scan()`

Like reduce; it emits the intermediate accumulated value when a new
value shows up.

```js
let outputStream = dataStream.scan((previousValue, currentValue) => {
  return previousValue + currentValue;
}, 0)

data   |------ [1] -- [2] -- [-100] -->
output |[0] -- [1] -- [3] --- [-97] -->
```

### Let's enter the world of FRP

I'm going to keep harping on this slide, but it's important. The core
architecture of FRP apps involves these three steps. If you've fallen
asleep during this lecture, this is the time to wake up and take notes:

1. **Transform inputs** with `map()`
2. **Recompute state** with `scan()`
3. **Update outputs** with `map()` and `filter()`

### Make a thing that tracks whether the mouse cursor is moving up or down.

In old Imperative-Land, we would have written this like so:

```js
var lastMovedCoordinate = {x: 0, y: 0};
$(window).on('mousemove', e => {
  let direction = (e.pageY < lastMovedCoordinate) ? 'up' : 'down'
  $('.output-container').html(`Moving ${direction}!`);
  lastMovedCoordinate = {x: e.pageX, y: e.pageY};
});
```

OK, so while this works, it's a little messy. It requires a state that
lives out in space, somewhere. It lives in callback code that handles
three duties: compute UI, update UI, update state.

Let's step back and build it the FRP Way (tm):

### 1. Transform inputs with `map()`

Our first task is to think through our app and ask: what are all the
inputs from the world? Well we're in luck - the only input this app will
take is from the mouse cursor.

```js
let mouseMoveStream = Rx.Observable.fromEvent(window, 'mousemove')

// mouseMoveStream: --[e]--[e]--[e]--[e]-->
```

Now every time the mouse moves, a JS object is emitted that contains
the mousemove `event` object.

But wait! We're not done. We should transform the data into the input
format we care about. Here's where `map()` comes into play:

```js
let mouseMoveStream = Rx.Observable.fromEvent(window, 'mousemove')
  .map((e) => { {x: e.pageX, y: e.pageY} }

// mouseMoveStream: --[{x:,y:}]--[{x:,y:}]--[{x:,y:}]--[{x:,y:}]-->
```

OK. Now we've truly separated out the domain. Now mouseMoveStream
contains a set of domain objects that correspond to the x and y
positions of the mouse.

### 2. Recompute application state with `scan()`.

Here's another key principle of FRP: state is computed solely from the
events that come in over our input streams, and nothing more. Let's see
this in action.

First, we consider what state means to this application. What data do we
need to store from event to event to be meaningful to our application?
We need:

* To track the last event that came through, so we can compare our
  current coordinate and determine whether it moved up or down.
* To track the current computed directional state of the cursor.

First we come up with an initial state:

```js
let initialState = {lastCoordinate: {x: 0, y: 0}, direction: null};
```

Note how it is a simple data structure. Next we update the application state
based on the current (incoming) event.

```js
let currentState = mouseMoveStream.scan((oldState, newCoordinate) => {
  let newDirection = oldState.lastCoordinate.y < newCoordinate.y ? 'down' :
'up';
  return {lastCoordinate: newCoordinate, direction: newDirection};
}, initialState)

// mouseMoveStream: -----[A]--[B]--[C]--[D]-->
//    currentState: [-]--[u]--[u]--[d]--[u]-->
```

Each time an event comes in, currentState recomputes new state and sets
its accumulated value to the new value. Note how we formulate
`initialState` and set it to some state that makes sense.

### 3. Filter (route) output signals to the right outputs.

Now we need to think of the system output. Once the state has been
recomputed, what needs to change? In our app's world, there is a simple
piece of UI that needs to update.

In RxJS, side effects such as modifying the DOM are performed in
`subscribe` blocks.

```js
currentState.subscribe(newState => {
  $('.output').text(`Mouse direction is: ${newState.direction}`);
});
```

OK, in this toy example, not that much needs to change.

### Extra RxJS bit: call `subscribe` to activate the stream and perform side effects.

RxJS tries to be smart and only process signals when it has to, meaning
streams do not become active until they are `subscribe()`ed to.
Additionally, your side effects (meaning updating the UI) should occur
from within the `subscribe()` call.

```js
currentState.subscribe(newState => {
  $('.raw-output').html(`<div>x: ${newState.pageX}, y:${newState.pageY}</div>`);
});
```

Phew! Let's [see it in action](http://localhost:8080/example1.html).

## An aside on dataflow

What we've done is model our system in terms of dataflow. You can see
our simple app works kind of like this:

```plantuml
title SimpleDataflow
top to bottom direction
(mouseMoveStreamDOMEvent) --> (mouseMoveStream) : map
(mouseMoveStream) --> (currentState) : scan
(initialState) --> (currentState) : scan
(currentState) --> (updateDOM) : subscribe
```

## OK, let's move toward making a pedometer!


## Addendum/Warnings/Disclaimers

- FRP requires special use cases.
- FRP has special semantics around handling errors (in streams).

### FRP overall pattern:

* signals
* state computation
* actions

## From Elm:

1. transform inputs to streams (map)
2. merge inputs into signal (merge)
3. update state of app architecture (foldp (reduce) )
4. route values to appropriate service (filter)

In Elm, a signal = a Bacon.js property

## In Redux:

1. Actions are inputs
2. State is recomputed with reducers
3. Updates are processed from state.

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
