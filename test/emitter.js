var assert  = require('assert');
var emitter = require('..');

describe('EventEmitter', function() {

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

  });

  // ===================================================================

  describe('.emit()', function() {

    it('should not throw if done is undefined or a function', function(done) {

      emitter().emit('test');
      emitter().emit('test', function() {
        done();
      });

    });

    it('should throw if done is not undefined and not a function', function() {

      assert.throws(function() {
        emitter().emit('test', 'test');
      });

      assert.throws(function() {
        emitter().emit('test', 1);
      });

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

      var that = emitter();
      that
        .on('test', function(event) {
          called = true;
          assert.equal('test',  event.getName());
          assert.equal(that,    event.getEmitter());
          assert.equal('function', typeof(done));
        })
        .emit('test', function() {
          assert(called);
        })
      ;

    });

  });

  // ===================================================================

  describe('Asynchronous', function() {

    it('should call listener with an event object and a done method and then call done', function(testdone) {
      var called = false;

      var that = emitter();
      that
        .on('test', function(event, done) {
          called = true;
          assert.equal('test',  event.getName());
          assert.equal(that,    event.getEmitter());
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

  describe('Stoppable', function() {

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
        .emit(new emitter.StoppableEvent('test'))
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
        .on('test', function(event, done) {
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