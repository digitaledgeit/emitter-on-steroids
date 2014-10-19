
/**
 * An event
 * @constructor
 */
function Event() {
  this.name     = null;
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
 * Get whether the event has been stopped from propagating
 * @returns {boolean}
 */
Event.prototype.isPropagationStopped = function() {
  return this.stopped;
};

/**
 * Stop the event from propagating
 * @returns {Event}
 */
Event.prototype.stopPropagation = function() {
  this.stopped = true;
  return this;
};

module.exports = Event;