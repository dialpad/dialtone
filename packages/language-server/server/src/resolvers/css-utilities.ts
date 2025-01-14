const fs = require('fs');
const path = require('path');
const cssNodeExtract = require('css-node-extract');
const DialtoneCSSFile = fs.readFileSync(path.resolve(__dirname, '../../node_modules/@dialpad/dialtone-css/lib/dist/dialtone-default-theme.css'), 'utf-8');

const options = {
    // CSS source code as string.
    css: DialtoneCSSFile,
    // Extract only .
    filters: ['rules'],
};

function _extractClasses() {
    cssNodeExtract.process(options).then((extractedCSS) => {
        fs.writeFileSync(path.resolve(__dirname, 'dialtone-utility-class-docs.css'), extractedCSS, 'utf-8')
    })
}

_extractClasses();
