#!/usr/bin/env node

/**
 * Builds the android tokens to the correct final package format (output to dist_android)
 */

const mvn = require('maven').create();
mvn.execute(['package'])
