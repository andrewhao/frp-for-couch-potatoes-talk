Pedometer Extras
----------------

The following contains advanced topics on accelerometer data. I realized it was too much to talk about in an FRP talk, so that remains for another talk.

## Mouse movements -> Accelerometer.

Let's first match up our mouse model to use acceleration. Now we are
going to actually start thinking of our mouse cursor as either having
positive acceleration or negative acceleration.

You may remember the formula for acceleration as being the second order
derivative of velocity. And velocity is the derivative of points.

The instantaneous velocity between two points is:

dY/dT: delta Y (pixels) over delta T (seconds)

We can formulate this like so:

```js
let mouseVelocityStream = mouseMoveStream
  .timestamp()
  .pairwise()
  .map((coordinatePair) => {
    let [first, last] = coordinatePair;
    let deltaTime = last.timestamp - first.timestamp;
    let deltaY = last.value.y - first.value.y;
    return deltaY / deltaTime;
  })
```

So the `timestamp()` operator wraps values in a {timestamp: <DateTime>,
value: <value>} object. `pairwise()` matches up values with their
preceding values. The `map()` statement in there is a way to calculate
`dY/dT`.

Let's do it one more time - the change in velocity over time equals
acceleration: `A = dV/dT`.

```js
let mouseAccelStream = mouseVelocityStream
  .timestamp()
  .pairwise()
  .map((coordinatePair) => {
    let [first, last] = coordinatePair;
    let deltaTime = last.timestamp - first.timestamp;
    let deltaVelocity = last.value - first.value;
    return deltaVelocity / deltaTime;
  })
```

## Ok we just got past the mathy parts. What's next?

Let's formulate our algorithm here. We know that we need to calculate the points of a step. What actually happens in a step? Well the acceleration of the body changes - it jumps from positive to negative. What we need to do is the following:

Calculate peak detection of acceleration at the inflection point - when it's rising to when it's falling.

```js
// -[+][+][+][+][+][+][-][-][-][-][-][-][-][+][+][+][+]-->
// --[u]----[d]--[u]---[d]---[u]------[d]---[u]---------->
// --[u]---------------[d]------------------[u]---------->


