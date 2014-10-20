# emitter-on-steroids

Not your average emitter. An event emitter with the following features:

- global listeners
- synchronous and asynchronous listeners
- stoppable events
- error handling
- works in the browser too

## Example

### Creating an instance

	var emitter1 = emitter();
	
or
	
	var emitter2 = new emitter();

or
	
	var MyClass = function() {}
	emitter(MyClass);
	var emitter3 = new MyClass();

### Global listeners

Global listeners are registered with the special wildcard name and are called for every event emitted. Global listeners 
are called before regular listeners.

	emitter()
	  .on('*', function() {
	    console.log('listener #1');
	  })
	  .emit('test')
	;

### Synchronous and Asynchronous listeners

	emitter()
	  .on('test', function() {
        console.log('listener #1');
      })
	  .on('test', function(event, done) {
	    console.log('listener #2');
        done();
	  })
	  .emit('test', function() {
	    //called after all listeners have finished
	  })
	;

### Stoppable events
	
	emitter()
	  .on('test', function(event) {
	    console.log('listener #1');
	    event.stopPropagation();
	  })
	  .on('test', function() {
	    console.log('listener #2');
	  })
	  .emit(new emitter.StoppableEvent('test'))
	;


### Error Handling
	
#### Synchronous

	emitter()
	  .on('test', function() {
	    console.log('listener #1');
	    throw new Error('A test error');
	  })
	  .emit('test', function(err) {
	    console.log('done', err);
	  })
	;

#### Asynchronous

	emitter()
	  .on('test', function(event, done) {
	    console.log('listener #1');
	    done(new Error('A test error'));
	  })
	  .emit('test', function(err) {
	    console.log('done', err);
	  })
	;


## API

### EventEmitter

#### EventEmitter() or new EventEmitter()

Create a new emitter instance.

#### emitter(object : Object)

Mixin emitter methods into object.

#### .on(name : String, listener : Function(Event, [done : Function()]))

Register a listener to receive notifications each time an event is emitted.

#### .once(name : String, listener : Function(Event, [done : Function()]))

Register a listener to receive notifications the next time an event is emitted.

#### .off(name : String, listener : Function(Event, [done : Function()]))

Un-register a listener from receiving notifications each time an event is emitted.

#### .emit(event : String|Event, [done : Function(Event)]))

Notifies listeners that an event occurred.

### Event

#### .getName()

Get the event name.

#### .getEmitter()

Get the event emitter.


### StoppableEvent

#### .getName()

Get the event name.

#### .getEmitter()

Get the event emitter.

#### .isPropagationStopped()

Whether the event has been stopped from propagating.

#### .stopPropagation()

Stops the event from propagating.