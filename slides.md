class: middle

# Reactive Programming for Couch Potatoes

*(Nothing against couch potatoes)*

---

class: middle

# Hi, I'm Andrew.

Friendly neighborhood programmer at Carbon Five.

---

class: background-image-contain middle center

![Carbon Five](http://www.carbonfive.com/images/c5-logo-vertical.png)

---

class: middle

## I've been an OO programmer for a very long time.

The paradigms there have served me well.

???

As an OO programmer, I've had a lot of exposure to tried-and-true
aphorisms: the law of demeter. Different modeling patterns.

---

class: middle

## But the functional world was beckoning

* Declarative over imperative
* Pure functions
* Dataflow
* Not having to worry so much about state

???

I read about the powerful functional constructs and combinators. I was
dazzled by how people described this new world.

---

class: middle

## I'm a runner.

I've been running for a very long time.

---

class: middle center

#### *(Consistently injured for just as long.)*

---

class: middle

## How do I stop getting hurt?

Develop a quicker stride rate

---

class: middle

## Run with a metronome

So you can learn to internalize the correct stride cadence.

???

Sidebar discussion: focusing on cadence is good for your run form. But
that's a talk for another meetup.

---

class: middle

I've heard it said:

### "Reactive programming is programming with asynchronous data streams."
---

class: middle

## Let's dive into reactive and make a pedometer.

???

Reactive programming was my way to both sharpen my functional toolbelt,
but also a way for me to try to get better in my training as a runner
and athelete.

---

class: middle center

#### *(Couch potatoes unite.)*

---

## Today's talk

* Intro to FRP
* RxJS
* Building a pedometer
* Cycle.js
* Throwing it on a Pebble watch

---

class: middle

I've heard it said:

### "Reactive programming is programming with asynchronous data streams."

---

class: middle

OK. Back up. Let's talk about streams.

## Streams are like pipes.

---

class: middle white-text

background-image: url(images/pipes_oops.jpg)

## Streams are like pipes.

--

background-image: url(images/pipes2.jpg)

--

background-image: url(images/pipes.jpg)

???

You'll want to sit down and get comfortable here.

What is a stream? A stream is like a pipe. Like a UNIX pipe, but more
colloquially, like a plumbing pipe. Like you're trying to hook up a faucet to the
water main, kind of pipe.

---

class: small-code

### Helpful (?) analogy

Streams are asynchronous arrays that change over time.

```js
let prices = [1, 5, 10, 11, 22]

// 5 seconds later...
[1, 5, 10, 11, 22, 44]

// 10 seconds later...
[1, 5, 10, 11, 22, 44, 100]

// And you get the ability to observe changes:
prices.on('data', (thing) => console.log(thing))

// => 100
```

???

You might also think about it like having an Array that you never get to
peek the entireity of, because it may potentially be infinite.

---

### Hopefully more helpful analogy

Streams are like arrays, only:

* You can't peek "into" the stream to see the past or future.
* You're holding onto the end of the pipe!
* You can only observe what comes through, at that moment in time.

???

But if you counted up all the values you saw coming out of the end of
the pipe, you could basically piece that array back together.

---

class: middle

```js
prices: --[1]
```

---

class: middle

```js
prices: --[x]--[5]
```

---

class: middle

```js
prices: --[x]--[x]----[10]
```

---

class: middle

```js
prices: --[x]--[x]----[x]-------[11]
```

---

class: middle

```js
prices: --[x]--[x]----[x]-------[x]------...
```

???

Point being here that you choose to transform a value coming out at the
end of the pipe.

---

### Streams are in:

Look familiar?

- Unix pipes: `ls | grep 'foo' > output.log`
- Websockets
- Twitter Streaming API
- Node `streams` lib
- Gulp
- Express

???

Where have you seen streams before? A WebSocket. Anything in Node that
opens a file, or starts a web request (usually backed by an
EventEmitter).

---

### An aside on Node streams

```js
    +-----+   +-----+   +-----+
+-> |  A  +-> |  B  +-> |  C  +->
    +-----+   +-----+   +-----+
```

You may be familiar with Node streams.

* Chainable with `pipe()`
* Backpressure capabilities to handle mismatched producers/consumers


---

### An aside on Node streams

```js
    +-----+   +-----+   +-----+
+-> |  A  +-> |  B  +-> |  C  +->
    +-----+   +-----+   +-----+
```

* BUT: You must manage stream state: `start`, `data`, `end`.
* BUT: lack of expressive functional operators

---

class: middle

### Let's forget you've ever heard about them (for now).

???

Trust me, this will help clear out the terminology.

---

class: middle

### "Reactive programming is programming with asynchronous data streams."

???

Back to the mantra of Reactive Programming...

---

class: middle 

## streams = `Observable`s

We will use the terms interchangeably today.

???

OK, I promise I'll never do this to you again, but this name change is
going to help. Streams are also termed Observables in Rx-land because
they are like Arrays (or more generically, Sequences) that continuously
grow over time, and their changing value sequences are, well, observable.

Like you can subscribe to them, and see how they change.

---

### F is for Functional.

```js
let f = (x) => x + 4
```

```js
     +------+
1 +--> f(x) +--> 5
     +------+
```

???

Let's recap: a function is a relationship between a set of inputs and a set of outputs.

---

### F is for Functional.

```js
let f = (x) => x < 10
```

```js
     +------+
1 +--> f(x) +--> false
     +------+
```

--

You just wait. There's lots more boxes and arrows where that came from.

???

The F in FRP relates to the fact that we are going to be using functions to transform data and connect transformed inputs and outputs.

---

class: middle

## Streamify all the things.

Now let's think of these functions in the context of streams.


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

class: middle

## Step by step, build the pedometer.

---

### Normalize the Accelerometer data

![Data animated](images/raw-data-animated.gif)

---

class: xsmall-code

### Normalize the Accelerometer data

```js
let motionData = eventsFromAccelerometer()
let normalData = motionData.map(acceleration => acceleration.y);
```
```marbles
motion: ---[{x:1,y:1,z:1}]--[{x:1,y:2,z:2}]--[{x:1,y:-100,z:1}]-->
normal:  ---[1]--------------[2]--------------[-100]-->
```

```marbles
     +-----------+         +------------+
+--> |motionData +-------> |normalData  +-->
     +-----------+         +------------+
                    {x:1,                  1
                     y:1,
                     z:1}
```
---

class: center

![Normalized](images/normalized-data.gif)

### Better.

---

## Keep your marbles.

```marbles
  data: ---[1]--[2]--[-100]-->
output: ---[t]--[t]--[f]----->
```

Marble diagrams are a thing:
[RxMarbles](http://rxmarbles.com/)

---

background-image: url(images/rxmarbles.png)

---

### Your Rx functional toolbelt

* `map`
* `filter`
* `zip`
* `flatMap`/`concatMap`
* `reduce`/`scan`
* `debounce`
* `combineWithLatest`
* `merge`

--

Special stream-oriented semantics here.

???

These look like normal operators, until you start to realize they have
specific time, or stream-oriented properties.

---

class: xsmall-code

### Peaks and troughs = steps

```marbles
 accel(m^2/s)
           20 ^
              |         XXXXX
           15 |      XXXX   XXX            XXX
              |    XXX        XX         XXX
           10 |   XX           X       XXX
              | XX             XXX   XXX
           5  |XX                XXXXX
              +--------------------------------> time (s)
                 1   2   3   4   5   6   7   8
```

```marbles
delta:      -[5]-[4]-[2]-[-2]-[-5]-[2]-[3]-[4]->
change:     -[+]-[+]-[+]-[-]--[-]--[+]-[+]-[+]->
stepEvents: -------------[S]-------[S]--------->
```

???

Little known fact: the derivative of acceleration is also called a jerk.

We're mathing the derivative of acceleration - which is also known as a "jerk". But we really only care about jerks that shifts from positive to negative - meaning that the person is shifting their weight downward.

---

class: xsmall-code

```js
// stream items of form: { power: 10, time: 1432485925 }
function detectSteps(stream) {
  return stream
  // Group elements in sliding window of pairs
  .pairwise()
  // Calculate change and step signals
  .map(([e1, e2]) => {
    return {
      "timestamp": e1.time,
      "diff": e2.power - e1.power,
    }
  })
  .map(v => Object.assign(v, { changeSignal: (v > 0) ? '+' : '-' }))
  // Every time a changeSignal flips, then the event
  // becomes a step signal.
  .distinctUntilChanged(v => v.changeSignal)
  // Smooth out erratic changes in motion.
  .debounce(DEBOUNCE_THRESHOLD)
};
```

---

class: xsmall-code

### Voila! A beautiful pedometer.

```
          +--------------+    +------------+   +-----------------+
{xyz} +-> |normalizeData +->  |detectSteps +-> |calculateCadence +-> 66.31
          +--------------+    +------------+   +-----------------+
```

---

class: xsmall-code

### Voila! A beautiful pedometer.

```

        +--------------------------------------------------------+
        |+--------------+    +------------+   +-----------------+|
{xyz} +>-|normalizeData +->  |detectSteps +-> |calculateCadence |--> 66.31
        ||              |    |            |   |                 ||
        |+--------------+    +------------+   +-----------------+|
        |                       Pedometer                        |
        +--------------------------------------------------------+

```

---

class: xsmall-code

### Voila! A beautiful pedometer.

```
        +--------------------------------------------------------+
        |                                                        |
{xyz}-->|                       Pedometer                        |--> 66.31
        |                                                        |
        +--------------------------------------------------------+

```
--

Essentially one long transformation.

---

class: middle

### More complicated things lie on the horizon.

Full-featured, rich apps need:

- state management
- composability
- modularity

???

So we made a pedometer, which is basically a transformation function.

Let's do some more complicated things. Like make an app.

Apps are complicated because they have to account for intermediate state. They have to coordinate between multiple inputs and outputs.

---

class: middle

#### *(Psst. We'll only need streams.)*

---

### FRP apps follow a common pattern:

1. **Transform inputs** with `map()`
--

2. **Recompute state** with `scan()`
--

3. **Update outputs** with `map()` and `filter()`

???

I'm going to keep harping on this slide, but it's important. The core
architecture of FRP apps involves these three steps. If you've fallen
asleep during this lecture, this is the time to wake up and take notes:

---

class: small-code middle

```marbles
         +------+    +------+      +-----+---------+
in +---> | map  +--> |      |  +-->+ map | filter  +---> out
         +------+    |      |  |   +-----+---------+
                     | scan +--+
         +------+    |      |  |   +-----+---------+
in +---> | map  +--> |      |  +-->+ map | filter  +---> out
         +------+    +------+      +-----+---------+

         1) Xform    2) Recompute  3) Update
```

--

* `in`: DOM events. Domain events. HTTP responses.
* `out`: DOM updates. Domain events. HTTP requests.

---

### 1. Transform inputs with `map()`

*Ask yourself:* What are the inputs into the app?

---

class: small-code

Well, we have our accelerometer.

```js
let accelerometerData =
  Rx.Observable.fromEvent(window,
                          'devicemotion')
  .map(e => Object.assign({}, e.accelerometer))

// accelerometerData: --[ { x:, y:, z: } ]--->
```

???

Our first task is to think through our app and ask: what are all the
inputs from the world? Well we're in luck - the only input this app will
take is from the accelerometer itself.

--

We should also plug that into our pedometer.

```js
let cadence = connectPedometer(accelerometerData)
.map(cadence => ({ name: CADENCE_EMITTED,
                   value: cadence }))

// cadence: --[ { name: CADENCE_EMITTED, value: 66.1234 } ]-->
```

---

class: small-code

### Transform inputs, cont'd

There's also DOM event data to account for:

```js
let startButton =
  Rx.Observable.fromEvent($('button#start'), 'click')
  .map((e) => { { name: 'START' } } }

// startButton: --[ { name: 'START' } ]-->
```

---

class: xsmall-code

### Merge these together into an input stream:

```js
let actions = Rx.Observable.merge(
	startButton,
	cadence
)

// actions: --[ { name: START } ]--
//            [ { name: CADENCE_EMITTED, value: 66.1234 } ] -->
```

---

### 2. Recompute application state with `scan()`.

*Ask yourself:* What is the minimum amount of state that my app needs to
store?

- Anything that the UI is dependent upon
- Anything that stores a value that is necessary for future events to
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

```js
const initialState = {
  cadence: 0,
  runState: STOPPED,
}
```
--

Note how it is a simple data structure.

---

class: xsmall-code

Next we update the application state based on the current (incoming) event.

```js
let currentState = actions.scan(
  (oldState, action) => {
    switch(action.name) {
    case START:
      return Object.assign({}, oldState { runState: STARTED })
    case CADENCE_EMITTED:
      return Object.assign({}, oldState, { cadence: action.value })
    default:
      return oldState
    }
  }, initialState)
  .startWith(initialState);

// actions: -----------------[START]--------[CADENCE_EMITTED, 66.12]->
// current: -[{STOPPED, 0}]--[{STARTED,0}]--[{STARTED, 66.12}]-->
```

???

Each time an event comes in, currentState recomputes new state and sets
its accumulated value to the new value. Note how we formulate
`initialState` and set it to some state that makes sense.

---

class: small-code

### 3. Update outputs (UI) upon state change.

Conditionally update the UI based on the state of the app's `runState`.

```js
currentState
.filter(newState => newState.runState === STARTED)
.subscribe(newState => {
  $('.output').text(
    `${newState.cadence} steps per minute (SPM)`
  );
});
```

???

Now we need to think of the system output. Once the state has been
recomputed, what needs to change? In our app's world, there is a simple
piece of UI that needs to update.

---

class: small-code

### Extra RxJS bit: call `subscribe` to attach an observer and "activate" the stream.

```js
currentState.subscribe(newState => {
  // Perform side effects like:
  // Render the DOM
  // Make an HTTP request
  // Push an event onto a Websocket
});
```

--

(Cold) streams produce values only after an Observer attaches.

???

RxJS tries to be smart and only process signals when it has to, meaning
streams do not become active until they are `subscribe()`ed to.
Additionally, your side effects (meaning updating the UI) should occur
from within the `subscribe()` call.

---

class: center middle

### Phew! Let's see it in action.

[http://tinyurl.com/rxcadence](http://tinyurl.com/rxcadence)

(Open this on your phone!)

---

class: center middle

![Harness in action](images/live-data-harness.gif)

---

class: center

## Zoom out: Organizing your FRP app with Cycle.js

<img src="images/cyclejs_logo.svg" width=200 />

---

class: center

### High level insight from Cycle: apps are really feedback loops:

<img src="images/cycle-loop.png" width=600 />

---

### Dialogue Abstraction

The computer is a function,
* Taking **inputs** from the keyboard, mouse, touchscreen,
* and **outputs** through the screen, vibration, speakers.

The human is a function,
* Taking **inputs** from their eyes, hands, ears,
* and **outputs** through their fingers.

---

class: middle

### Inputs and outputs you say?

---

class: small-code 

```
      +------------------------+
      |                        |
+-----+      Computer          | <--+
|     |                        |    |
|     +------------------------+    |
|                                   |
|                                   |
|                                   |
|     +------------------------+    |
|     |                        |    |
+---> |      Human             +----+
      |                        |
      +------------------------+
```

---

class: small-code

```
              +------------------------+
DOM           |                        |  accelerometer evts
       +------+      Computer          | <--+
       |      |                        |    |
       |      +------------------------+    |
       |                                    |
       |                                    |
       |                                    |
       |      +------------------------+    |
       |      |                        |    |
       +----> |      Human             +----+
see screen    |                        |  moves
              +------------------------+
```

---

class: small-code

```
              +------------------------+
              |                        |
       +------+          main()        | <--+
       |      |                        |    | DeviceMotion
       |      +-------------+----------+    | Events
       |                    ^               |
Virtual|                DOM |          +----+-----+
    DOM|             Events |          |  Motion  |
       |                    |          |  Driver  |
       |           +--------+------+   |          |
       |           |   DOM         |   +----------+
       +---------> |   Driver      |
                   |               |
                   +-----+--+------+
                         |  ^
                         |  |
                         v  |
                    +----+--+----+
                    |    DOM     |
                    +------------+

```

---

class: xsmall-code

```js
import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, input, p, makeDOMDriver} from '@cycle/dom';

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('input').events('change')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        div([
          input({type: 'checkbox'}), 'Toggle me',
          p(toggled ? 'ON' : 'off')
        ])
      )
  };
  return sinks;
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});
```

---

### See how it's done:

* [Cycle.js Introduction](http://cycle.js.org/getting-started.html)
* [RxCadence test harness app](https://github.com/andrewhao/quickcadence/blob/master/reference/js/RxJSRunner.js)

---

## FRP reducer pattern

* Cycle.js: [Reducer pattern](http://staltz.com/reducer-pattern-in-cyclejs.html)
* Redux: [Actions/Reducers/React](http://redux.js.org/docs/basics/Reducers.html)
* Elm: [Model/Update/View](https://github.com/evancz/elm-architecture-tutorial)

---

## Oh, about the Pebble

You can load arbitrary Javascript libraries (like RxJS) on a Pebble!

Cloud Pebble: http://www.cloudpebble.com

PebbleJS: https://pebble.github.io/pebblejs/

---

Cloudpebble:

background-image: url(images/cloudpebble.png)

---

class: center

### Sweetcadence

<a href="https://apps.getpebble.com/en_US/application/5637f7b277a1ea0c45000009A"><img src="images/pebble-appstore.png" width=300px /></a>

---

## Recap

* Learn to see everything as a stream.
* Slowly build your tool familiarity with RxJS. They are powerful, but
  they have a learning curve.

---

## Recap (cont'd)

* Reducer pattern:
  - Map inputs
  - Recompute state
  - Update output
* Abstract your app as a dialogue between the user and the system.

---

### Further reading (and many thanks!)

* ["The Introduction to Reactive Programming You've Been Missing"](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* ["OMG Streams!"](https://www.youtube.com/watch?v=3iKkwzlch0o)
* RxMarbles: http://rxmarbles.com/
* ReactiveX: http://reactivex.io/learnrx/
* Cycle.js docs: http://cycle.js.org

---

class: middle center

### Thanks!

**Github**: [andrewhao](https://www.github.com/andrewhao)

**Twitter**: [@andrewhao](https://www.twitter.com/andrewhao)

**Email**: [andrew@carbonfive.com](mailto:andrew@carbonfive.com)

---

class: middle

### Image attributions:

* https://www.flickr.com/photos/alphageek/210677885/
* https://www.flickr.com/photos/95744554@N00/156855367/
* https://www.flickr.com/photos/autowitch/4271929/
* https://www.flickr.com/photos/internetarchivebookimages/14776039484
* 
