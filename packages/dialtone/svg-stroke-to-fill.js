const fs = require('fs');
const path = require('path');
const svgStrokeToFill = require('oslllo-svg-fixer');

const transform = (
  source = '',
  destination = '',
  options = {
    traceResolution: 100,
    showProgressBar: false,
  },
) => {
  if (!source || !destination) return;

  const iconsSource = path.resolve(path.join(__dirname, source));
  const iconsDestination = path.resolve(path.join(__dirname, destination));

  if (!fs.existsSync(iconsSource)) return;
  if (!fs.existsSync(iconsDestination)) {
    fs.mkdirSync(iconsDestination, { recursive: true });
  }

  return new Promise(resolve => {
    svgStrokeToFill(iconsSource, iconsDestination, options).fix((err) => {
      if (err) throw err;
      resolve();
    });
  });
};

module.exports = {
  transform,
};
