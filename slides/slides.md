class: middle

# Reactive Programming for Couch Potatoes

*(Nothing against couch potatoes)*

---

class: middle

# Hi, I'm Andrew.

Friendly neighborhood programmer at Carbon Five.

---

class: middle

## Before we begin: follow along at home!

[https://github.com/andrewhao/frp-for-couch-potatoes-talk](https://github.com/andrewhao/frp-for-couch-potatoes-talk)

---

# I've been hearing lots about FRP.

--

"Reactive programming is programming with asynchronous data streams."

--

But... what... how... so confused!

---

## Today's talk

* Intro to FRP
* Building blocks
* RxJS
* Build an example project
* Who else uses FRP?

---

### We will be looking at FRP through a Javascript lens.

--

* It's popular.

--

* You get it.

--

* It's frontend and backend.

--

* It's not perfect.


???

I'm choosing Javascript because it's how I first encountered Rx and streams. And my guess is that you're pretty familiar with Javascript too. We can look at other frameworks and languages later.

---

class: middle

## Streams are your friends.

---

class: middle white-text

background-image: url(pipes_oops.jpg)

## Streams are like pipes.

--

background-image: url(pipes2.jpg)

---

class: top

background-image: url(wire.jpg)

## Or wires.

---

class: top white-text

background-image: url(pipes.jpg)

## I like pipes.

???

You'll want to sit down and get comfortable here.

What is a stream? A stream is like a pipe. Like a UNIX pipe, but more
colloquially, like a plumbing pipe. Like you're trying to hook up a faucet to the
water main, kind of pipe.

---

## And you're familiar with them.

### Streams are in:

- Unix pipes `|` `>` ..
- Twitter stream API
- WebSockets
- Node `streams` library.

???

Where have you seen streams before? A WebSocket. Anything in Node that
opens a file, or starts a web request (I mean, heck it's called a
`stream` after all.)

---

class: small-code

## Helpful (?) analogy

Streams are changing, asynchronous arrays.

```js
let appleStockPrices = [1, 5, 10, 11, 22]
// [1, 5, 10, 11, 22, 44]
// [1, 5, 10, 11, 22, 44, 100]
```

???

You might also think about it like having an Array that you never get to
peek the entireity of, because it may potentially be infinite.

---

### If you can build it with Events, you can model it as a stream.

Anything you've been doing with Events can also be modeled as a stream.

```js
$(window).on('mousemove', function(e) {
  console.log(e.target.x, e.target.y);
  // do something with this new movement.
});
```

???

For example, you might think about the position of a mouse cursor on a
screen as a stream. You have probably doing something like this:

---

## Voila - streams!

What if you thought about this like a pipe of mousemoves... with an unknown number of future values?

```js
mouseMoveStream = [{x: 0, y: 0},
                   {x: 1, y: 122},
                   {x: 155, y: 23},
                   THE FUTURE...]
```

???

But what if you thought about it like a pipe? Like you were holding onto
a pipe of mousemove events coming through. It would look like:

---

class: middle

### "Reactive programming is programming with asynchronous data streams."

???

Back to the mantra of Reactive Programming...

---

### Other things that are streamable

In fact, lots of other things in your software that, previously modeled
as events (either explicitly, or as domain events), could be considered streams:

- `submittedForm` Event -> `formSubmitStream`
- `publishedNewsFeed` Event -> `newsFeedPublishStream`
- Any Node `EventEmitter` is easily converted to a stream.

---

class: middle

## Name change!

Streams are, more generically, `Observable`s.

???

OK, I promise I'll never do this to you again, but this name change is
going to help. Streams are also termed Observables in Rx-land because
they are like Arrays (or more generically, Sequences) that continuously
grow over time, and their changing value sequences are, well, observable.

---

### There are things already called Observables out there!

- RxJS has an Observable interface.
- Anything in the ReactiveX family implements an Observable interface.
- Bacon.js and Kefir.js also implement Observables.
- ES7 ships with Observables (it's the FUTURE).

---

### F is for Functional.

Let's recap: a function is a relationship between a set of inputs and a set of outputs.

```js
let f(x) = x + 4

x: 1 y: 5
x: 2 y: 6
x: 3 y: 7
```

---

### F is for Functional.

```js
let f(x) = x < 10

x: 1  y: true
x: 11 y: false
```

The F in FRP relates to the fact that we are going to be using functions to transform data and connect transformed inputs and outputs.

---

## Your function(al) toolbelt

* `map()`
* `filter()`
* `reduce()` / `scan()`

--

And the more advanced stuff:

* `combineLatest()`
* `zip()`

???

Now that we have streams of things, let's get to some things you can do with them.

You may be familiar with the toolbelt of transformation functions available to programmers today.

---

class: small-code

## `map()`

```js
var data = [1, 2, -100];
data.map(function(datum) { return datum > 0 });
// => [true, true, false]
```

---

class: small-code

## `reduce()`

```js
var data = [1, 2, -100];
data.reduce(function(previousValue, currentValue) {
  return previousValue + currentValue;
}, 0)

// => -97
```

???

Perform some sort of aggregate operation on a set of values, iteratively
returning the result of the last run.

---

class: small-code

## `filter()`

```js
var data = [1, 2, -100];
data.filter(function(v) { return v > 0; });

// => [1, 2]
```

???

Only accepts values for which criteria returns true.

---

class: middle

## Now let's think of these functions in the context of streams.

Streamify all the things.

???

I'm going to introduce a new way of seeing code. We're going to take a
timeline of values that pop into existence asynchronously. Meaning,
you're looking at a potentially unbounded array of size infinity, but
you don't know how long the stream will continue to emit data, or whence
it will fire. All you know is how to hook up your stream to react to the
next thing coming down the pipe.

Let's go back and look at our `map` example, but this time, `data` will
be `dataStream`, some sampling of data that is generated asynchronously.
Maybe it's from a file, maybe it's from a websocket.

---

class: small-code

### Streamify it!

```js
let dataStream = getAsyncDataStream()
let outputStream = dataStream.map((datum) => datum > 0);
```

Now, when a value pops into existence on the `dataStream`, the `outputStream`
will also produce a new value:

```marbles
  data: ---[1]--[2]--[-100]-->
output: ---[t]--[t]-----[f]-->
```

---

## Whoa, what was that?

```marbles
  data: --[1]--[2]--[-100]-->
output: --[t]--[t]-----[f]-->
```

Marble diagrams are a thing:
[RxMarbles](http://rxmarbles.com/)

---

class: small-code

### Marbles, cont'd

Imagine this sort of thing could also happen with filter:

```js
let outputStream = dataStream.filter((v) => v > 0);

//   data: |-- [1] -- [2] -- [-100] -->
// output: |-- [1] -- [2] ------------>
```

Magic.

---

class: xsmall-code

## `scan()`

Like reduce; it emits the intermediate accumulated value when a new
value shows up.

```js
let outputStream = dataStream.scan((previousValue,
                                    currentValue) => {
  return previousValue + currentValue;
}, 0)

data   |------ [1] -- [2] -- [-100] -->
output |[0] -- [1] -- [3] --- [-97] -->
```

???

Now there *is* a `reduce` equivalent in streams, but it's probably not
what you're looking for. You are probably looking for something like
`scan`, which is like a partial-reduce.

---

## Let's enter the world of FRP

1. **Transform inputs** with `map()`
2. **Recompute state** with `scan()`
3. **Update outputs** with `map()` and `filter()`

???

I'm going to keep harping on this slide, but it's important. The core
architecture of FRP apps involves these three steps. If you've fallen
asleep during this lecture, this is the time to wake up and take notes:

---

class: middle

## Dataflow

FRP gives us the ability to model our system at a higher level of
abstraction that is oriented around the flow of data through our system.

???

---

class: background-image-contain

background-image: url(data_flow_diagram.png)

???

```plantuml
title SimpleDataflow
top to bottom direction
(mouseMoveStreamDOMEvent) --> (mouseMoveStream) : map
(mouseMoveStream) --> (currentState) : scan
(initialState) --> (currentState) : scan
(currentState) --> (updateDOM) : subscribe
```

---

class: xsmall-code

### Make a thing that tracks whether the mouse cursor is moving up or down.

```js
var lastMovedCoordinate = {x: 0, y: 0};
$(window).on('mousemove', e => {
  let direction = (e.pageY < lastMovedCoordinate) ?
                  'up' : 'down'
  $('.output-container').html(`Moving ${direction}!`);
  lastMovedCoordinate = {x: e.pageX, y: e.pageY};
});
```
--

* But state is stored in an arbritrary context.
* Callback code manages several responsibilities.

???

OK, so while this works, it's a little messy. It requires a state that
lives out in space, somewhere. It lives in callback code that handles
three duties: compute UI, update UI, update state.

---

class: middle

## Build it again the FRP Way (tm)

???

What if we could build things differently? The FRP way.

---

class: small-code

### 1. Transform inputs with `map()`

*Ask yourself:* What are the inputs into the app?

```js
let mouseMoveStream =
  Rx.Observable.fromEvent(window,
                          'mousemove')
// mouseMoveStream: --[e]--[e]--[e]--[e]-->
```

???

Our first task is to think through our app and ask: what are all the
inputs from the world? Well we're in luck - the only input this app will
take is from the mouse cursor.

Now every time the mouse moves, a JS object is emitted that contains
the mousemove `event` object.

---

class: small-code

### Transform inputs, cont'd

We should transform the data into the input
format we care about. Here's where `map()` comes into play:

```js
let mouseMoveStream =
  Rx.Observable.fromEvent(window, 'mousemove')
  .map((e) => { {x: e.pageX, y: e.pageY} }

// mouseMoveStream: --[{x:,y:}]--[{x:,y:}]--[{x:,y:}]--[{x:,y:}]-->
```

???

But wait! We're not done.

Now mouseMoveStream
contains a set of domain objects that correspond to the x and y
positions of the mouse.

--

Now this stream is expressive in terms of the domain.

---

### 2. Recompute application state with `scan()`.

*Ask yourself:* What is the minimum amount of state that my app needs to
store?

- A: Anything that the UI is dependent upon
- A: Anything that stores a value that is necessary for future events to
compute from.

???

Here's another key principle of FRP: state is computed solely from the
events that come in over our input streams, and nothing more. Let's see
this in action.

First, we consider what state means to this application. What data do we
need to store from event to event to be meaningful to our application?
We need:

---

### Application state for this app:

* To track the last event that came through, so we can compare our
  current coordinate and determine whether it moved up or down.
* To track the current computed directional state of the cursor.

---

class: small-code

### A data structure for state

First we come up with an initial state:

```js
let initialState = {lastCoordinate: {x: 0, y: 0},
                    direction: null};
```

Note how it is a simple data structure.

---

class: small-code

Next we update the application state based on the current (incoming) event.

```js
let currentState = mouseMoveStream.scan(
  (oldState, newCoordinate) => {
  let newDirection =
    oldState.lastCoordinate.y < newCoordinate.y ? 'down' :
'up';
  return {lastCoordinate: newCoordinate,
          direction: newDirection};
}, initialState)

// mouseMoveStream: -----[A]--[B]--[C]--[D]-->
//    currentState: [-]--[u]--[u]--[d]--[u]-->
```

???

Each time an event comes in, currentState recomputes new state and sets
its accumulated value to the new value. Note how we formulate
`initialState` and set it to some state that makes sense.

---

class: small-code

### 3. Update outputs (UI) upon state change.

In RxJS, side effects such as modifying the DOM are performed in
`subscribe` blocks.

```js
currentState.subscribe(newState => {
  $('.output').text(
    `Mouse direction is: ${newState.direction}`
  );
});
```
???

Now we need to think of the system output. Once the state has been
recomputed, what needs to change? In our app's world, there is a simple
piece of UI that needs to update.

--

Ours is a simple use case.

???

OK, in this toy example, not that much needs to change.

---

class: small-code

### Extra RxJS bit: call `subscribe` to activate the stream and perform side effects.

```js
currentState.subscribe(newState => {
  $('.raw-output').html(
    `<div>x: ${newState.pageX}, y:${newState.pageY}</div>`
  );
});
```

--

Streams are lazily evaluated.

???

RxJS tries to be smart and only process signals when it has to, meaning
streams do not become active until they are `subscribe()`ed to.
Additionally, your side effects (meaning updating the UI) should occur
from within the `subscribe()` call.


---

class: background-image-contain

background-image: url(data_flow_diagram.png)

---

class: center middle

Phew! Let's [see it in action](http://localhost:8080/pedometer/example1.html).

---

class: middle center

## OK, let's make a pedometer!*

(* sorta)

---

class: middle center

[Follow along in the source](https://github.com/andrewhao/frp-for-couch-potatoes-talk/blob/master/pedometer/pedometer-example-2.js)

---
class: background-image-contain

background-image: url(extended-dataflow.png)

???

```plantuml
title MoreDataflow
top to bottom direction
(mouseMoveStreamDOMEvent) --> (mouseMoveStream) : map
(mouseMoveStream) --> (directionStream) : map
(directionStream) --> (directionChangeStream) : distinctUntilChanged
(directionChangeStream) -->(stepTakenStream) : scan/filter/map
(stepTakenStream) --> (combinedEventStream) : merge
(directionChangeStream) --> (combinedEventStream) : merge
(combinedEventStream) --> (currentState) :scan
(initialState) --> (currentState) : scan
(currentState) --> (updateDOM) : subscribe
```

---

### Error handling

FRP has special semantics around handling errors (in streams).

```js
let someStream = doSomethingRx();
someStream.catch(e => {
  // handle error
})
```

This is important because we can reason about errors in an explicit
manner.

---

## FRP overall pattern

| FRP Principle   |
|-----------------|
| Map inputs      |
| Recompute state |
| Update output   |

--

Watch as we apply these to other frameworks.

---

## From Elm...

| FRP Principle   | Elm              |
|-----------------|------------------|
| Map inputs      | `Action`         |
| Recompute state | `Model`          |
| Update output   | `View`, `Effect` |

???

Ajax (side effects)

Compose actions as Effects

---

![Elm Signal Graph](elm-signal-graph.png)

---

class: background-image-contain

background-image: url(elm-program.png)

---

## Elm, cont'd

1. transform inputs to streams (`map`)
2. merge inputs into signal (`merge`)
3. update state of app architecture (`foldp`)
4. route values to appropriate service (`filter`)

---

## ...to Redux

| FRP Principle   | Redux     |
|-----------------|-----------|
| Map inputs      | `Action` is a Redux event    |
| Recompute state | `Reducer` applied on a store |
| Update output   | `React` to update UI         |

---

## In Redux:

```
reducer = (state, action) => state
```

1. Actions are inputs
2. State is recomputed with reducers
3. Updates & side effects are created from state (React)

---

class: background-image-contain

background-image: url(redux-arch.png)

---

## FRP elsewhere

#### Netflix has some fantastic Reactive talks.

RxJS, Falcor, RxJava (Hystrix, circuit breakers)

#### Many other FRP frameworks/languages out there.

Cycle.js, Bacon.js, Highland.js, ClojureScript, Elm

---

### Further reading (and many thanks!)

* ["The Introduction to Reactive Programming You've Been Missing"](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* ["OMG Streams!"](https://www.youtube.com/watch?v=3iKkwzlch0o)
* RxMarbles: http://rxmarbles.com/
* ReactiveX: http://reactivex.io/learnrx/

---

## Recap

* Learn to see everything as a stream.
* Dataflow programming is powerful.
* FRP frameworks provide lots of tools. Use them!
* The pattern:
  - Map inputs
  - Recompute state
  - Update output

---

class: middle center

### I made a pedometer, I swear.

[https://github.com/andrewhao/quickcadence](https://github.com/andrewhao/quickcadence)

---

class: middle center

### Thanks!

https://www.github.com/andrewhao
https://www.twitter.com/andrewhao

---

class: middle

### Image attributions:

* https://www.flickr.com/photos/alphageek/210677885/
* https://www.flickr.com/photos/95744554@N00/156855367/
* https://www.flickr.com/photos/autowitch/4271929/
* https://www.flickr.com/photos/internetarchivebookimages/14776039484
