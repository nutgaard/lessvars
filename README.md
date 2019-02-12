# lessvars

Read [LESS](http://lesscss.org/) variables from a less-file and return all variables as a javascript object.
```js
$ npm install --save lessvars
```

### How does it work?
This library uses the `less`-library to parse the less-file into an AST. 
The AST is then walked in order to find all variables, this includes variables defined in imported files and where color-functions has been used.  

### Example

````less
// toBeImported.less
@fromAnImport: blue;

// index.less
@import "tobeImported";

@minVar1: blue;
@minVar2: #f00;
@minVar3: #f0ff00;
@minVar4: rgb(124, 124, 124);
@minVar5: rgba(124, 124, 124, 0.5);
@minVar6: hsl(120, 100%, 50%);
@minVar7: hsla(120, 100%, 50%, 0.75);
@minVar8: #ffffff;

@compondVar1: lighten(@minVar5, 20%);
@compondVar2: darken(@minVar6, 20%);
@compondVar3: mix(@minVar1, @minVar2, 50%);



@notACOlor: 3%;
@not2ACOlor: 3;
@hsv: hsv(120, 100%, 100%);

.test {
  @includeThis: blue;
}
````

Example output: 
````js
{
  "fromAnImport": "blue",
  "minVar1": "blue",
  "minVar2": "#f00",
  "minVar3": "#f0ff00",
  "minVar4": "#7c7c7c",
  "minVar5": "rgba(124, 124, 124, 0.5)",
  "minVar6": "#00ff00",
  "minVar7": "rgba(0, 255, 0, 0.75)",
  "minVar8": "#ffffff",
  "compondVar1": "rgba(175, 175, 175, 0.5)",
  "compondVar2": "#009900",
  "compondVar3": "#800080",
  "notACOlor": "3%",
  "not2ACOlor": "3",
  "hsv": "#00ff00",
  "includeThis": "blue"
}
````

**NOTE:** As seen by the example, it returns variables defined in imported files, within rules and resolves `darken`, `lighten` etc.  


### Usage

````js
import fs from 'fs';
import lessvars from 'lessvars';

const content = fs.readFileSync('./index.less', 'utf-8');

function printObject(obj) {
    Object.entries(obj)
        .forEach(([key, value]) => console.log(key, value));
}

// Use with callback
lessvars(content, (err, variables) => {
    printObject(variables);
});

// Use with promise
lessvars(content)
    .then(printObject);
````


### Lisence
[X11](https://tldrlegal.com/license/x11-license) (This license is identical to the [MIT](https://tldrlegal.com/license/mit-license) License, but with an extra sentence that prohibits using the copyright holders' names for advertising or promotional purposes without written permission.
                                                  )
