/*can-debug@1.0.0-pre.3#src/get-what-changes-me/get-what-changes-me*/
var getData = require('../get-data/get-data.js');
var getGraph = require('../get-graph/get-graph.js');
module.exports = function getWhatChangesMe(obj, key) {
    var gotKey = arguments.length === 2;
    return getData(gotKey ? getGraph(obj, key) : getGraph(obj), 'whatChangesMe');
};