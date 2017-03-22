import less from "less";
import Color from 'less/lib/less/tree/color';
import funcs from 'less/lib/less/functions/function-registry';
import 'less/lib/less/functions/function-registry';
import colors from "color-convert";
import fs from "fs";

const content = fs.readFileSync('./example/index.less', 'utf-8');

function getColor(node) {
    return node.value.value[0].value[0];
}

const asthandlermap = {
    value: (rgb) => {
        return new Color(rgb);
    },
    rgb: (args) => new Color(args.map(parseArg)),
    rgba: (args) => new Color(args.slice(0, 3).map(parseArg), +parseArg(args[3])),
    hsl: (args) => new Color(colors.hsl.rgb(args.map(parseArg))),
    hsla: (args) => new Color(colors.hsl.rgb(args.map(parseArg)), +parseArg(args[3])),
};

function parseArg(arg) {
    if (arg.hasOwnProperty('value')) {
        return `${arg.value}`
    }
    throw new Error(`Node did not have a value prop. ${arg}`);
}

function parseFunctionArgs(varmap) {
    return (arg) => {
        if (arg.hasOwnProperty('name')) {
            if (!varmap.hasOwnProperty(arg.name)) {
                throw new Error(`Could not find variable name ${arg.name}`);
            }
            return varmap[arg.name];
        }
        return arg;
    }
}

function hasKeywordValue(value) {
    try {
        colors.keyword.hex(value);
        return true;
    } catch (e) {
        // console.log(`exception`, value, e);
        return false;
    }
}

function asthandler(node, varmap) {
    if (node.type === 'Color') {
        return node;
    } else if (asthandlermap[node.name]) {
        if (node.type === 'Color')throw new Error('No need for this3');
        return asthandlermap[node.name](node.args);
    } else if (funcs.get(node.name)) {
        if (node.type === 'Color')throw new Error('No need for this4');
        const prepArgs = node.args.map(parseFunctionArgs(varmap));
        return funcs.get(node.name).apply(null, prepArgs);
    }
    throw new Error('What should I do with this node...');
}

function recurse(node, varmap = {}) {
    if (node.isLineComment) return;
    if (node.variable === true) {
        try {
            varmap[node.name] = asthandler(getColor(node), varmap);
        } catch (e) {
            console.error(e);
            console.error(JSON.stringify(node, null, 2));
        }
    } else if (node.rules) {
        node.rules.forEach((rule) => recurse(rule, varmap));
    }
}

export default function getVariables(content, cb) {
    const varmap = {};
    less.parse(content, (err, tree) => {
        if (err) {
            throw new Error(err);
        }
        recurse(tree, varmap);

        if (cb) {
            cb(err, varmap);
        }
    });
    return varmap;
}
