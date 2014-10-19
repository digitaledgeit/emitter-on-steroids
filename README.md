# event-emitter

An event emitter with the following features:

- async listeners
- global listeners i.e. '*'
- a formal event object that allows interruption of event propagation

## API

### EventEmitter

#### EventEmitter() or new EventEmitter()

Create a new emitter instance.

#### emitter(object : Object)

Mixin emitter methods into object.

#### .on(name : String, listener : Function(Event, [done : Function()]))

#### .once(name : String, listener : Function(Event, [done : Function()]))

#### .off(name : String, listener : Function(Event, [done : Function()]))

#### .emit(event : String|Event, [done : Function(Event)]))

### Event

#### .getName()

Get the event name.

#### .getEmitter()

Get the event emitter.

## TODO

- handling errors - err argument in listener's and emit's done callback or a `error` event?