var emitter = require('../emitter');

emitter()
  .on('test', function(event) {
    console.log('test listener 1');
  })
  //.on('test', function(event, done) {
  //  setTimeout(function() {
  //    //event.stopPropagation();
  //    console.log('test listener 2');
  //    done();
  //  }, 1000);
  //})
  .once('test', function() {
    console.log('test listener 3');
  })
  .once('test', function() {
    console.log('test listener 4');
  })
  .emit('test', function() {
    console.log('DONE');
  })
  .emit('test', function() {
    console.log('DONE');
  })
;
