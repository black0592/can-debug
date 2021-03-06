var formatGraph = require("./format-graph");
var getGraph = require("../get-graph/get-graph");

module.exports = function drawGraph(obj, key) {
	var gotKey = arguments.length === 2;
	var graph = gotKey ? getGraph(obj, key) : getGraph(obj);

	fetch(__dirname + "/vis.js")
		.then(function(res) {
			return res.text();
		})
		.then(function(code) {
			var w = window.open("", "can-debug: Dependency Graph");
			var doc = w.document;
	
			// inject the visualization library code into the new window
			var script = doc.createElement("script");
			script.text = code;
			doc.body.appendChild(script);
	
			var data = formatGraph(graph);
			var drawScript = doc.createElement("script");
			drawScript.text = ` 
				var container = document.createElement("div");
	
				var options = {
					physics: {
						solver: "repulsion"
					}
				};

				document.title = "can-debug: Dependency Graph";
				document.body.appendChild(container);

				new vis.Network(
					container, 
					{
						nodes: new vis.DataSet(${ JSON.stringify(data.nodes) }),
						edges: new vis.DataSet(${ JSON.stringify(data.edges) })
					},
					options
				);
			`;
			doc.body.appendChild(drawScript);
		});
};
