import React, { useCallback, useContext, useEffect } from 'react';
import ReactFlow, { addEdge, ConnectionLineType, useNodesState, useEdgesState } from 'react-flow-renderer';
import dagre from 'dagre';

import { createNodesAndEdges } from './nodes-edges.js';
import { store } from "../../../../store/store";

import './index.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';


    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};


const LayoutFlow = () => {


  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const globalState = useContext(store);
  

  useEffect(()=>{
    const {initialNodes, initialEdges} = createNodesAndEdges(globalState.state)
    getLayoutedElements(initialNodes, initialEdges)
    setNodes(initialNodes)
    setEdges(initialEdges)
  },[globalState.state])



  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    []
  );

  return (
    <div className="layoutflow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      />
    </div>
  );
};

export default LayoutFlow;
