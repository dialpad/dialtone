#!/usr/bin/env node

const mvn = require('maven').create();
mvn.execute(['package'])
