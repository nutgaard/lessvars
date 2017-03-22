// Solution inspired by https://github.com/aarki/grunt-lessvars
import { parse, contexts, transformTree } from "less";

function collect(node, context, variables = {}) {
    for (let rule of node.rules) {
        if (rule.isRuleset)
            collect(rule, context, variables);
        else if (rule.importedFilename)
            collect(rule.root, context, variables);
        else if (rule.variable === true) {
            const name = rule.name.substring(1);
            const value = rule.value.eval(context);

            // save under all aliases
            variables[name] = value.toCSS(context);
        }
    }

    return variables;
}

export default function getVariables(content, cb) {
    const variables = parse(content)
        .then((root) => collect(root, new contexts.Eval({}, [transformTree(root)])));

    if (cb) {
        variables
            .then((vars) => cb(null, vars))
            .catch((err) => cb(err));
    }
    return variables;
};