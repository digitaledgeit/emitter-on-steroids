var Event = require('./event');

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
 * @param   {String}    name        The event name
 * @param   {Function}  listener    The event listener
 * @returns {EventEmitter}
 */
EventEmitter.prototype.once = function(name, listener) {
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
 * @param   {String}    name        The event name
 * @param   {Function}  listener    The event listener
 * @returns {EventEmitter}
 */
EventEmitter.prototype.off = function(name, listener) {

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
 * @param   {Function(Event)}           [done]
 * @returns {EventEmitter}
 */
EventEmitter.prototype.emit = function(event, done) {

  // --- setup the event ---

  var name;
  if (typeof(event) === 'string') {
    name  = event;
    event = new Event();
  } else {
    name = event.getName();
  }
  event.name    = name;
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

  function callNextListener() {

    //while there are more listeners to call
    if (listeners.length > 0 && i < listeners.length) {

      //check if we should stop
      if (event.isPropagationStopped()) {

        //we're done
        if (done) done(event);

        //stop
        return;
      }

      //get the next event listener
      var callback = listeners[i];

      //move to the next event listener
      ++i;

      //call the event listener synchronously or asynchronously
      if (callback.length <= 1) {
        callback(event); //sync
        callNextListener();
      } else {
        callback(event, callNextListener); //async
      }

    } else {

      //we're done
      if (done) done(event);

    }

  }

  //call the first event listener
  callNextListener();

  return this;
};


module.exports = EventEmitter;