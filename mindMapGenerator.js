const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");

const execPromise = util.promisify(exec);

function generateGraphvizDOT(data) {
    let dot = `digraph G { node [shape=box, style=filled, fillcolor=lightblue];`;

    function addNodes(parent, obj) {
        Object.entries(obj).forEach(([key, value]) => {
            let nodeId = key.replace(/\s+/g, "_");
            dot += `"${parent}" -> "${nodeId}";\n`;

            if (Array.isArray(value)) {
                value.forEach(subItem => {
                    let subId = subItem.replace(/\s+/g, "_");
                    dot += `"${nodeId}" -> "${subId}";\n`;
                });
            } else if (typeof value === "object" && value !== null) {
                addNodes(nodeId, value);
            }
        });
    }

    dot += `"${data.name}" [shape=ellipse, fillcolor=yellow];\n`;
    if (data.mind_map_nodes) {
        addNodes(data.name, data.mind_map_nodes);
    }
    dot += "}";

    return dot;
}

async function generateMindMap(summary) {
    const dotContent = generateGraphvizDOT(summary);
    const dotFilePath = path.join(__dirname, "mindmap.dot");
    const outputImagePath = path.join(__dirname, "mindmap.png");

    fs.writeFileSync(dotFilePath, dotContent);
    await execPromise(`dot -Tpng "${dotFilePath}" -o "${outputImagePath}"`);

    return fs.readFileSync(outputImagePath);
}

module.exports = { generateMindMap };
