/*can-debug@1.0.0-pre.2#src/get-data/get-data*/
define([
    'require',
    'exports',
    'module',
    '../label-cycles/label-cycles'
], function (require, exports, module) {
    var labelCycles = require('../label-cycles/label-cycles');
    var isDisconnected = function isDisconnected(data) {
        return !data.twoWay.length && !data.dependencies.length && !data.mutations.length;
    };
    module.exports = function getDebugData(inputGraph, direction) {
        var visited = new Map();
        var graph = labelCycles(direction === 'whatChangesMe' ? inputGraph.reverse() : inputGraph);
        var visit = function visit(node) {
            var data = {
                node: node,
                dependencies: [],
                mutations: [],
                twoWay: []
            };
            visited.set(node, true);
            graph.getNeighbors(node).forEach(function (adj) {
                var meta = graph.getArrowMeta(node, adj);
                if (!visited.has(adj)) {
                    switch (meta.kind) {
                    case 'twoWay':
                        data.twoWay.push(visit(adj));
                        break;
                    case 'derive':
                        data.dependencies.push(visit(adj));
                        break;
                    case 'mutate':
                        data.mutations.push(visit(adj));
                        break;
                    default:
                        throw new Error('Unknow meta.kind value: ', meta.kind);
                    }
                }
            });
            return data;
        };
        var result = visit(graph.nodes[0]);
        return isDisconnected(result) ? null : result;
    };
});