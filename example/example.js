var emitter = require('../emitter');
var StoppableEvent = require('../events').StoppableEvent;

// === Synchronous listener ===

emitter()
  .on('test', function() {
    console.log('listener #1');
  })
  .emit('test', function() {
    console.log('done #1', arguments);
  })
;

// === Asynchronous listener ===

emitter()
  .on('test', function(done) {
    setTimeout(function() {
      console.log('listener #1');
      done();
    }, 1000);
  })
  .emit('test', function() {
    console.log('done #2', arguments);
  })
;

// === Global listener ===

emitter()
  .on('*', function() {
    console.log('listener #1');
  })
  .emit('test', function() {
    console.log('done #3', arguments);
  })
;

// === Stoppable event ===

emitter()
  .on('test', function(event) {
    console.log('listener #1');
    event.stopPropagation();
  })
  .on('test', function() {
    console.log('listener #2');
  })
  .emit(new StoppableEvent('test'), function() {
    console.log('done #4', arguments);
  })
;

// === Error handling ===

emitter()
  .on('test', function() {
    console.log('listener #1');
    throw new Error('A test error');
  })
  .emit('test', function() {
    console.log('done #5', arguments);
  })
;

emitter()
  .on('test', function(done) {
    console.log('listener #1');
    done(new Error('A test error'));
  })
  .emit('test', function() {
    console.log('done #6', arguments);
  })
;
