#!/usr/bin/env node

/**
 * Builds the android tokens to the correct final package format (output to dist_android)
 */

import Maven from 'maven';
const mvn = Maven.create();
mvn.execute(['package']);
