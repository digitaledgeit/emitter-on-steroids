/**
 * Get whether the default event action has been prevented
 * @returns {boolean}
 */
function isDefaultPrevented() {
  return this.prevented === true;
}

/**
 * Prevent the default event action from executing
 * @returns {Event}
 */
function preventDefault() {
  this.prevented = true;
  return this;
}

/**
 * Get whether the event has been stopped from propagating
 * @returns {boolean}
 */
function isPropagationStopped() {
  return this.stopped === true;
}

/**
 * Stop the event from propagating
 * @returns {Event}
 */
function stopPropagation() {
  this.stopped = true;
  return this;
}

/**
 * An event
 * @constructor
 * @param   {String} name
 * @param   {EventEmitter} emitter
 */
function Event(name, emitter) {
  this.name     = name;
  this.emitter  = null;
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
 * Mixin preventable event methods
 * @param   {Object} object
 * @returns {Object}
 */
Event.preventable = function(object) {
  object.isDefaultPrevented   = isDefaultPrevented;
  object.preventDefault       = preventDefault;
  return object;
};

/**
 * Mixin stoppbable event methods
 * @param   {Object} object
 * @returns {Object}
 */
Event.stoppable = function(object) {
  object.isPropagationStopped = isPropagationStopped;
  object.stopPropagation      = stopPropagation;
  return object;
};

module.exports = Event;
