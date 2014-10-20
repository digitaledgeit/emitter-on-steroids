var emitter = require('../emitter');

// === Synchronous listener ===

emitter()
  .on('test', function() {
    console.log('listener #1');
  })
  .emit('test')
;

// === Asynchronous listener ===

emitter()
  .on('test', function(event, done) {
    setTimeout(function() {
      console.log('listener #1');
      done();
    }, 1000);
  })
  .emit('test')
;

// === Global listener ===

emitter()
  .on('*', function() {
    console.log('listener #1');
  })
  .emit('test')
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
  .emit('test')
;

// === Error handling ===

emitter()
  .on('test', function() {
    console.log('listener #1');
    throw new Error('A test error');
  })
  .emit('test', function(err) {
    console.log('done', err);
  })
;

emitter()
  .on('test', function(event, done) {
    console.log('listener #1');
    done(new Error('A test error'));
  })
  .emit('test', function(err) {
    console.log('done', err);
  })
;
