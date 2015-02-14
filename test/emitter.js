var assert          = require('assert');
var emitter         = require('..');
var Event           = require('../event');

describe('EventEmitter', function() {

  describe('.on()', function() {

    it('should throw if listener is not a function', function() {

      assert.throws(function() {
        emitter().on('test');
      });

      assert.throws(function() {
        emitter().on('test', 'test');
      });

      assert.throws(function() {
        emitter().on('test', 1);
      });

    });

    it('the callback scope should be should be the emitter when sync', function() {
      var ee = emitter();
      ee
        .on('test', function() {
          assert.equal(this, ee);
        })
        .emit('test')
      ;
    })

    it('the callback scope should be should be the emitter when async', function(done) {
      var ee = emitter();
      ee
        .on('test', function(done) {
          assert.equal(this, ee);
          done();
        })
        .emit('test', done)
      ;
    })

  });

  // ===================================================================

  describe('.once()', function() {

    it('should only trigger once', function() {
      var count = 0;

      emitter()
        .once('test', function() {
          ++count;
        })
        .emit('test')
        .emit('test')
      ;

      assert.equal(1, count);
    });

    it('shouldn\'t remove other listeners', function() {
      var first = 0, second = 0;

      emitter()
        .on('test', function() {
          ++first;
        })
        .once('test', function() {
          ++second;
        })
        .emit('test')
        .emit('test')
      ;

      assert.equal(2, first);
      assert.equal(1, second);
    });

    it('should throw if listener is not a function', function() {

      assert.throws(function() {
        emitter().once('test');
      });

      assert.throws(function() {
        emitter().once('test', 'test');
      });

      assert.throws(function() {
        emitter().once('test', 1);
      });

    });

    it('should receive the `next` method for async listeners', function(done) {

      emitter()
        .once('test', function(next) {
          assert.equal(typeof(next), 'function');
          next();
        })
        .emit('test', function(err) {
          assert.equal(err, undefined);
          done();
        })
      ;

    });

  });

  // ===================================================================

  describe('.off()', function() {

    it('should remove the first listener', function() {
      var called = [];

      function first() {
        called.push('first');
      }

      function second() {
        called.push('second');
      }

      emitter()
        .on('test', first)
        .on('test', second)
        .off('test', first)
        .emit('test')
      ;

      assert.equal(1, called.length);
      assert.equal('second', called[0]);
    });

    it('shouldn\'t remove any listeners', function() {
      var called = [];

      function first() {
        called.push('first');
      }

      function second() {
        called.push('second');
      }

      emitter()
        .on('test', second)
        .off('test', first)
        .emit('test')
      ;

      assert.equal(1, called.length);
      assert.equal('second', called[0]);
    });

    it('should throw if listener is not a function', function() {

      assert.throws(function() {
        emitter().off('test');
      });

      assert.throws(function() {
        emitter().off('test', 'test');
      });

      assert.throws(function() {
        emitter().off('test', 1);
      });

    });

  });

  // ===================================================================

  describe('.emit()', function() {

    it('should pass arguments to sync listener', function() {
      var d=3, e=2, f=3;

      emitter()
        .on('test', function(a, b, c) {
          assert.equal(d, a);
          assert.equal(e, b);
          assert.equal(f, c);
        })
        .emit('test', d, e, f)
      ;

    });

    it('should pass arguments to async listener', function(testdone) {
      var d=3, e=2, f=3;

      emitter()
        .on('test', function(a, b, c, done) {
          assert.equal(d, a);
          assert.equal(e, b);
          assert.equal(f, c);
          assert.equal('function', typeof(done));
          done();
        })
        .emit('test', d, e, f, testdone)
      ;

    });

    it('should pass arguments to done callback', function() {
      var d=3, e=2, f=3;

      emitter()
        .emit('test', d, e, f, function(err, a, b, c) {
          assert.equal(undefined, err);
          assert.equal(d, a);
          assert.equal(e, b);
          assert.equal(f, c);
        })
      ;

    });

  });

  // ===================================================================

  describe('Global', function() {

    it('should always call global listeners first', function() {
      var called = [];

      emitter()
        .on('test', function() {
          called.push('test');
        })
        .on('*', function() {
          called.push('*');
        })
        .emit('test')
      ;

      assert.equal('*', called[0]);
      assert.equal('test', called[1]);
    });

  });

  // ===================================================================

  describe('Synchronous', function() {

    it('should call listener with an event object and then call done', function() {
      var called = false;

      emitter()
        .on('test', function() {
          called = true;
        })
        .emit('test', function() {
          assert(called);
        })
      ;

    });

  });

  // ===================================================================

  describe('Asynchronous', function() {

    it('should call listener and then call done', function(testdone) {
      var called = false;

      emitter()
        .on('test', function(done) {
          called = true;
          assert.equal('function', typeof(done));
          done();
        })
        .emit('test', function() {
          assert(called);
          testdone();
        })
      ;

    });

  });

  // ===================================================================

  describe('Formal', function() {

    it('should pass event object as first arg to listener', function() {

      emitter()
        .on('test', function(event) {
          assert.equal('test', event.getName());
        })
        .emit(new Event('test'))
      ;

    });

    it('should pass event object as first arg to done callback', function() {

      emitter()
        .emit(new Event('test'), function(err, event) {
          assert.equal('test', event.getName());
        })
      ;

    });

    it('should stop event propagation', function() {
      var count = 0;

      emitter()
        .on('test', function(event) {
          ++count;
          event.stopPropagation();
        })
        .on('test', function() {
          ++count;
        })
        .emit(Event.stoppable(new Event('test')), function(err, event) {
          assert(event.isPropagationStopped());
        })
      ;

      assert.equal(1, count);
    });

  });

  // ===================================================================

  describe('Errors', function() {

    it('an error thrown in a sync listener should result in an error being passed to the done function', function () {
      emitter()
        .on('test', function() {
          throw new Error('A test error');
        })
        .emit('test', function(err) {
          assert(err instanceof Error);
          assert.equal('A test error', err.message);
        })
      ;
    });

    it('an error returned from an async listener should result in an error being passed to the done function', function (testdone) {
      emitter()
        .on('test', function(done) {
          setTimeout(function() {
            done(new Error('A test error'));
          }, 0);
        })
        .emit('test', function(err) {
          assert(err instanceof Error);
          assert.equal('A test error', err.message);
          testdone();
        })
      ;
    });

  });

  // ===================================================================

});