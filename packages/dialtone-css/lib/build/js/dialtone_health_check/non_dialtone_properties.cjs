const fs = require('fs');
const defaultSearch = [
  'color',
  'background-color',
  'border-color',
  'font-family',
];
let totalPropertiesCount = 0;

const main = (props = defaultSearch, files, noLineNumbers) => {
  const regex = props.map(property => {
    return new RegExp(`^\\s*${property}:\\s(?:(?!var\\(--))(?:(?!@)).*`, 'gm');
  });
  try {
    for (const file of files) {
      const data = fs.readFileSync(file, 'utf8');
      const lines = data.split('\n');
      let propertiesMatch;
      let propertiesCount = 0;

      for (const [lineNumber, line] of lines.entries()) {
        regex.forEach(re => {
        // eslint-disable-next-line no-cond-assign
          while (propertiesMatch = re.exec(line)) {
            if (!noLineNumbers) {
              console.log(`\tnon-dialtone property found on line ${lineNumber + 1}: ${propertiesMatch}`);
            }
            propertiesCount++;
            totalPropertiesCount++;
          }
        });
      }
      if (propertiesCount > 0) {
        console.log(`${file}: ${propertiesCount}`);
      }
    }
    console.log(`Found ${totalPropertiesCount} total ${props.join(', ')} \
   CSS properties that are not dialtone in this directory.`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = main;
