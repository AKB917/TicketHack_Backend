// This module exports a function that checks if all specified keys are present in a given object.
// It is used to validate the request body in an Express.js route handler.
function checkBody(body, keys) {
  return keys.every(key => Object.keys(body).includes(key));
}

module.exports = { checkBody };
