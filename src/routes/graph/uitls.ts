const dagre = require('dagre');
// Create a new directed graph

export function getNodePosition(nodes: any[], edges: any[]) {
    const g = new dagre.graphlib.Graph();

    // Set an object for the graph label
    g.setGraph({});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () {
        return {};
    });

    // Add nodes to the graph. The first argument is the node id. The second is
    // metadata about the node. In this case we're going to add labels to each of
    // our nodes.
    nodes.forEach((node) => {
        g.setNode(node.elementId, {
            label: node.title,
            width: 400,
            height: 50,
        });
    });

    // Add edges to the graph.
    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target, { label: edge.elementId });
    });

    dagre.layout(g);

    // Store node positions
    let nodesList: any[] = [];
    g.nodes().forEach(function (node: any) {
        nodesList.push({
            elementId: node,
            position: { x: g.node(node).x, y: g.node(node).y },
        });
    });

    const nodesOut = nodes.map((node) => {
        const nodePos = nodesList.find((n) => n.elementId === node.elementId);
        if (!nodePos) throw new Error('Node not found');
        return {
            ...node,
            position: nodePos.position,
        };
    });

    return nodesOut;
}
