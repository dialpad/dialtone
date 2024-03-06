"use strict";

const requireIndex = require("requireindex");

// import all rules in lib/rules
module.exports = requireIndex(__dirname + "/rules");
