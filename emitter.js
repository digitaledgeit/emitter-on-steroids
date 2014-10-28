var events = require('./events');

function assertFn(fn, msg) {
  if (typeof(fn) !== 'function') {
    throw new Error(msg);
  }
}

function assertFnOrUndefined(fn, msg) {
  if (typeof(fn) !== 'undefined') {
    assertFn(fn, msg);
  }
}

/**
 * An event emitter
 * @constructor
 */
function EventEmitter() {

  //if called as a function (and not a constructor) then create a new instance or mixin
  if (!(this instanceof EventEmitter)) {
    if (arguments.length === 0) {
      return new EventEmitter();
    } else {
      for (var key in EventEmitter.prototype) {
        if (EventEmitter.prototype.hasOwnProperty(key)) {
          arguments[0][key] = EventEmitter.prototype[key];
        }
      }
      return arguments[0];
    }
  }

}

/**
 * Add an event listener
 * @param   {String}    name        The event name
 * @param   {Function}  listener    The event listener
 * @returns {EventEmitter}
 */
EventEmitter.prototype.on = function(name, listener) {
  assertFn(listener, '`listener` parameter must be a function.');

  //create the event listener hash if it doesn't already exist
  if (!this._listeners) {
    this._listeners = {};
  }

  //create the event listener hash if it doesn't already exist
  if (!this._listeners[name]) {
    this._listeners[name] = [];
  }

  //add the event listener to the hash
  this._listeners[name].push(listener);

  return this;
};

/**
 * Add an event listener that listens to a single event before removing itself
 * @param   {String}                                name        The event name
 * @param   {Function(Event, [Function([Error])]}   listener    The event listener
 * @returns {EventEmitter}
 */
EventEmitter.prototype.once = function(name, listener) {
  assertFn(listener, '`listener` parameter must be a function.');

  var self = this;
  function once() {
    self.off(name, once);
    listener.apply(this, arguments);
  }

  this.on(name, once);
  return this;
};

/**
 * Remove an event listener
 * @param   {String}                                name        The event name
 * @param   {Function(Event, [Function([Error])]}   listener    The event listener
 * @returns {EventEmitter}
 */
EventEmitter.prototype.off = function(name, listener) {
  assertFn(listener, '`listener` parameter must be a function.');

  //check the event listener hash already exists
  if (!this._listeners || !this._listeners[name]) {
    return this;
  }

  //remove the event listener from the hash
  var i = this._listeners[name].indexOf(listener);
  if (i !== -1) {
    this._listeners[name].splice(i, 1);
  }

  return this;
};

/**
 * Emit an event
 * @param   {String|Event}              event
 * @param   {Function(Error, [Event])}  [done]
 * @returns {EventEmitter}
 */
EventEmitter.prototype.emit = function(event, done) {
  assertFnOrUndefined(done, '`done` parameter must be a function');

  // --- setup the event ---

  var name;
  if (typeof(event) === 'string') {
    name  = event;
    event = new events.Event(name);
  } else {
    name = event.getName();
  }
  event.emitter = this;

  // --- if there are no listeners listening for this event then we're done ---

  if (!this._listeners || (!this._listeners['*'] && !this._listeners[name])) {

    if (done) done(event);
    return this;
  }

  // --- build an array of event listeners ---

  var listeners = [];

  if (this._listeners['*']) {
    listeners = listeners.concat(this._listeners['*']);
  }

  if (this._listeners[name]) {
    listeners = listeners.concat(this._listeners[name]);
  }

  // --- call the next event listener, if there are no more event listeners to call then we're done ---

  var self=this, i=0;

  function callNextListener(err) {

    if (err) {

      //we're done
      if (done) done(err, event);

      //stop
      return;

    }

    //while there are more listeners to call
    if (listeners.length > 0 && i < listeners.length) {

      //check if we should stop
      if (typeof(event.isPropagationStopped) === 'function' && event.isPropagationStopped()) {

        //we're done
        if (done) done(err, event);

        //stop
        return;

      }

      //get the next event listener
      var callback = listeners[i];

      //move to the next event listener
      ++i;

      //call the event listener synchronously or asynchronously
      if (callback.length <= 1) {
        try {
          callback(event); //sync
          callNextListener();
        } catch(err) {
          callNextListener(err);
        }
      } else {
        callback(event, callNextListener); //async
      }

    } else {

      //we're done
      if (done) done(err, event);

      //stop
      return;

    }

  }

  //call the first event listener
  callNextListener();

  return this;
};

EventEmitter.Event = events.Event;
EventEmitter.StoppableEvent = events.StoppableEvent;

module.exports = EventEmitter;