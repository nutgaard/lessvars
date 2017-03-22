require('babel-register');
const fs = require('fs');
const lessvar = require('./../index').default;

const content = fs.readFileSync('./example/index.less', 'utf-8');

lessvar(content, (err, variables) => {
    Object
        .keys(variables)
        .map((key) => ([key, variables[key]]))
        .forEach(([key, value]) => console.log(key, value.toCSS({ compress: true })));
});

