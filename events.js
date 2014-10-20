
/**
 * An event
 * @constructor
 * @param   {String} name
 */
function Event(name) {
  this.name     = name;
  this.emitter  = null;
  this.stopped  = false;
}

/**
 * Get the event name
 * @returns {String}
 */
Event.prototype.getName = function() {
  return this.name;
};

/**
 * Get the event emitter
 * @returns {EventEmitter}
 */
Event.prototype.getEmitter = function() {
  return this.emitter;
};


/**
 * A stoppable event
 * @constructor
 * @param   {String} name
 */
function StoppableEvent() {
  Event.apply(this, arguments);
}

StoppableEvent.prototype = new Event();

/**
 * Get whether the event has been stopped from propagating
 * @returns {boolean}
 */
StoppableEvent.prototype.isPropagationStopped = function() {
  return this.stopped;
};

/**
 * Stop the event from propagating
 * @returns {Event}
 */
StoppableEvent.prototype.stopPropagation = function() {
  this.stopped = true;
  return this;
};


module.exports = {
  Event:            Event,
  StoppableEvent:   StoppableEvent
};