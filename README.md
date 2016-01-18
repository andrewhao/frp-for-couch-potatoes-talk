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

### But streams are also things that you may not have considered

Anything you've been doing with Events could also be thought of as a
stream.

For example, you might think about the position of a mouse cursor on a
screen as a stream. You have probably been printing something like this:

```js
$(window).on('mousemove', function(e) {
  console.log(e.target.x, e.target.y);
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
grow over time, and you can observe on them.

### Why else is this important? There are things already called Observables out there!

RxJs has an Observable interface. We shall use this.
ES7 ships with Observables (it's the FUTURE).

### F is for Functional.

```js
f(x) = ?
```

### Your function(al) toolbelt

Now that we have streams of things, let's get to some things you can do with them.

You may be familiar with the toolbelt of transformation functions
available to programmers today.

(See: RxMarbles examples)

* map

```js
var data = [{x: 1}, {x: 2}, {x: -100}];
data.map(function(datum) {
  return datum.x > 0
});
// => [{x: 1}, {x: 2}]
```
* reduce
* scan / fold
* filter

### Let's enter the world of FRP

I'm going to hammer home these next few points, but the gist of FRP is:

**map input signals, fold state, filter outputs**.

Let's take an example here with a form that submits a counter on a page.

### 1. Map input signals

OK, so let's formulate all inputs as streams. You'll most likely need to
do two things:

* Convert events to streams.

This is most likely a user event (DOM event?).

```js
var stream = blah.asEventStream();
```

* Map to the correct values.

```js
var stream.map(function(e) {
  return e.target.value;
});
```

Because we want the actual value, instead of the event stream.

### 2. Fold state.

Here's an overly simplistic idea of what state is:

```js
newState = reduce(oldState, action)
```

Here's our Rx tip: our state is managed as a function mapped from old
state to new, given new input.

```js
var buttonClickStream = stream; // Something we defined in the past;
var state = Rx.Observable.startWith({});
state.foldp()
```

### FRP overall pattern:

* signals
* state computation
* actions

From Elm:

1. transform inputs to streams (map)
2. merge inputs into signal (merge)
3. update state of app architecture (foldp (reduce) )
4. route values to appropriate service (filter)

In Elm, a signal = a Bacon.js property


### HTML5 example

1. accelerometer data

- map it: {x: y: z:} format to a Signal / Property / Event
- fold it (scan): generate state (SPM), then with given event, recalculate
  it.
- filter it: route the signal to the right place.


## Further reading:

* "The Introduction to Reactive Programming You've Been Missing": https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
* "OMG Streams!": https://www.youtube.com/watch?v=3iKkwzlch0o
* http://cycle.js.org/observables.html
* http://rxmarbles.com/
* http://reactivex.io/learnrx/
* https://medium.com/@codeandrop/es7-es2016-generators-observables-oh-my-ba07925f7a80#.z6h47c59n
