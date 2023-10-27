/**
 * Builds both sd tranforms and token transformer tokens and outputs documentation for all tokens.
 */

import { writeDocs } from './build-docs.js';

import { run as runSdTranforms } from './build-sd-transforms.js';
import { run as runTokenTransforms } from './build-token-transformer.js';

await runSdTranforms();
runTokenTransforms();

writeDocs();
