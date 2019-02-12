require('babel-register');
const fs = require('fs');
const lessvars = require('./../index').default;

const content = fs.readFileSync('./index.less', 'utf-8');

function printObject(obj) {
    Object.entries(obj)
        .forEach(([key, value]) => console.log(key, value));
}

console.log('Use with callback');
lessvars(content, (err, variables) => {
    printObject(variables);
});

lessvars(content)
    .then((variables) => {
        console.log('');
        console.log('Or, use with promises');
        printObject(variables);
    });
