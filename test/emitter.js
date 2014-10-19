var assert  = require('assert');
var Emitter = require('../emitter');

describe('EventEmitter', function() {

  describe('.emit()', function() {

    it('should call sync listener', function() {
      var called = false;

      Emitter()
        .on('test', function() {
          called = true;
        })
        .emit('test')
      ;

      assert(called);
    });

    it('should call async listener', function(done) {
      var called = false;

      var emitter = new Emitter();
      emitter
        .on('test', function(done) {
          called = true;
        })
        .emit('test', function() {
          assert(called);
          done();
        })
      ;

    });

    it('should receive an event object', function(done) {

      var emitter = new Emitter();
      emitter
        .on('test', function(event) {
          assert.equal('test',  event.getName());
          assert.equal(emitter, event.getEmitter());
          done();
        })
        .emit('test')
      ;

    });

    it('should receive an event object and a done method', function(done) {

      var emitter = new Emitter();
      emitter
        .on('test', function(event, cb) {
          assert.equal('test',  event.getName());
          assert.equal(emitter, event.getEmitter());
          assert.equal('function', typeof(cb));
          done();
        })
        .emit('test')
      ;

    });

    it('should call * listener first', function() {
      var called = [];

      var emitter = new Emitter();
      emitter
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

    it('should stop event propagation', function() {
      var called = [];

      var emitter = new Emitter();
      emitter
        .on('test', function(event) {
          called.push('test');
          event.stopPropagation();
        })
        .on('test', function() {
          called.push('test');
        })
        .emit('test')
      ;

      assert.equal(1, called.length);
    });

    it('should call done after sync listener', function() {
      var called = false;

      var emitter = new Emitter();
      emitter
        .on('test', function() {
        })
        .emit('test', function() {
          called = true;
        })
      ;

      assert(called);
    });

    it('should call done after async listener', function(done) {

      var emitter = new Emitter();
      emitter
        .on('test', function(event, cb) {
          cb();
        })
        .emit('test', function() {
          done();
        })
      ;

    });

  });

  describe('#off()', function() {

    it('should remove the first listener', function() {
      var called = [];

      function first() {
        called.push('first');
      }

      function second() {
        called.push('second');
      }

      var emitter = new Emitter();
      emitter
        .on('test', first)
        .on('test', second)
        .off('test', first)
        .emit('test')
      ;

      assert.equal(1, called.length);
      assert.equal('second', called[0]);
    });

    it('should not remove any listeners', function() {
      var called = [];

      function first() {
        called.push('first');
      }

      function second() {
        called.push('second');
      }

      var emitter = new Emitter();
      emitter
        .on('test', second)
        .off('test', first)
        .emit('test')
      ;

      assert.equal(1, called.length);
      assert.equal('second', called[0]);
    });

  });

});