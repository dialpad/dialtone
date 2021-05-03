import 'core-js/stable';
import 'regenerator-runtime/runtime';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const specs = require.context('../components', true, /.*.test.js$/);
for (const moduleName of specs.keys()) {
  specs(moduleName);
}
