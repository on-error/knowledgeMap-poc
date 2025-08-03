import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './KnowledgeMap.css';
import { type Node, type Edge } from 'reactflow';

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: string;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
}

interface KnowledgeMapProps {
  nodes: Node[];
  edges: Edge[];
}

const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ nodes, edges }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Convert ReactFlow nodes to D3 nodes
    const d3Nodes: D3Node[] = nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      group: getNodeGroup(node.data.label), // Function to determine group based on label
    }));

    // Convert ReactFlow edges to D3 links
    const d3Links: D3Link[] = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }));

    // Set up the SVG
    const width = 1200;
    const height = 800;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#010305");

    // Create a group for zooming
    const g = svg.append("g");

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Set up the force simulation
    const simulation = d3.forceSimulation<D3Node>(d3Nodes)
      .force("link", d3.forceLink<D3Node, D3Link>(d3Links).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    // Color scale for different groups
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["central", "components", "reaction-types", "decomposition", "equations", "energy", "related"])
      .range(["#4A90E2", "#7ED321", "#F5A623", "#D0021B", "#9013FE", "#50E3C2", "#BD10E0"]);

    // Create the links
    const link = g.append("g")
      .selectAll("line")
      .data(d3Links)
      .enter().append("line")
      .attr("class", "link-line")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.6);

    // Create the nodes
    const node = g.append("g")
      .selectAll("g")
      .data(d3Nodes)
      .enter().append("g")
      .call(d3.drag<SVGGElement, D3Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    node.append("circle")
      .attr("class", "node-circle")
      .attr("r", (d) => d.group === "central" ? 25 : 20)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        // Scale up the node circle
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d.group === "central" ? 25 : 20) * 1.5)
          .attr("stroke-width", 3);
        
        // Scale up the text - select the text element within the same node group
        d3.select(this.parentNode as Element)
          .select("text")
          .transition()
          .duration(200)
          .attr("font-size", "14px")
          .attr("font-weight", "700");
        
        // Highlight connected links
        link.style("stroke-opacity", (l: D3Link) => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          return sourceId === d.id || targetId === d.id ? 1 : 0.2;
        });
      })
      .on("mouseout", function(event, d) {
        // Scale down the node circle
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.group === "central" ? 25 : 20)
          .attr("stroke-width", 2);
        
        // Scale down the text - select the text element within the same node group
        d3.select(this.parentNode as Element)
          .select("text")
          .transition()
          .duration(200)
          .attr("font-size", "9px")
          .attr("font-weight", "600");
        
        // Reset link opacity
        link.style("stroke-opacity", 0.6);
      });

    // Add labels to nodes
    node.append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .attr("fill", "#fff")
      .style("pointer-events", "none");

    // Add zoom controls
    const zoomControls = svg.append("g")
      .attr("class", "zoom-controls")
      .attr("transform", "translate(20, 20)");

    // Zoom in button
    zoomControls.append("circle")
      .attr("cx", 15)
      .attr("cy", 15)
      .attr("r", 15)
      .attr("fill", "#fff")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        svg.transition().duration(300).call(
          zoom.scaleBy, 1.3
        );
      });

    zoomControls.append("text")
      .attr("x", 15)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "16px")
      .attr("fill", "#666")
      .text("+");

    // Zoom out button
    zoomControls.append("circle")
      .attr("cx", 15)
      .attr("cy", 45)
      .attr("r", 15)
      .attr("fill", "#fff")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        svg.transition().duration(300).call(
          zoom.scaleBy, 1 / 1.3
        );
      });

    zoomControls.append("text")
      .attr("x", 15)
      .attr("y", 45)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "16px")
      .attr("fill", "#666")
      .text("−");

    // Reset zoom button
    zoomControls.append("circle")
      .attr("cx", 15)
      .attr("cy", 75)
      .attr("r", 15)
      .attr("fill", "#fff")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        svg.transition().duration(300).call(
          zoom.transform, d3.zoomIdentity
        );
      });

    zoomControls.append("text")
      .attr("x", 15)
      .attr("y", 75)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text("⌂");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: D3Link) => {
          const source = typeof d.source === 'string' ? d3Nodes.find(n => n.id === d.source) : d.source;
          return source?.x || 0;
        })
        .attr("y1", (d: D3Link) => {
          const source = typeof d.source === 'string' ? d3Nodes.find(n => n.id === d.source) : d.source;
          return source?.y || 0;
        })
        .attr("x2", (d: D3Link) => {
          const target = typeof d.target === 'string' ? d3Nodes.find(n => n.id === d.target) : d.target;
          return target?.x || 0;
        })
        .attr("y2", (d: D3Link) => {
          const target = typeof d.target === 'string' ? d3Nodes.find(n => n.id === d.target) : d.target;
          return target?.y || 0;
        });

      node
        .attr("transform", (d: D3Node) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  // Function to determine node group based on label
  const getNodeGroup = (label: string): string => {
    const lowerLabel = label.toLowerCase();
    
    // Central concepts
    if (lowerLabel.includes('chemical reaction') || lowerLabel.includes('chemical equation')) {
      return 'central';
    }
    
    // Reaction components
    if (lowerLabel.includes('reactant') || lowerLabel.includes('product')) {
      return 'components';
    }
    
    // Types of reactions
    if (lowerLabel.includes('reaction') && !lowerLabel.includes('chemical reaction')) {
      return 'reaction-types';
    }
    
    // Decomposition types
    if (lowerLabel.includes('decomposition')) {
      return 'decomposition';
    }
    
    // Equation components
    if (lowerLabel.includes('formula') || lowerLabel.includes('symbol') || 
        lowerLabel.includes('equation') || lowerLabel.includes('condition') ||
        lowerLabel.includes('state')) {
      return 'equations';
    }
    
    // Energy and indicators
    if (lowerLabel.includes('energy') || lowerLabel.includes('exothermic') || 
        lowerLabel.includes('endothermic')) {
      return 'energy';
    }
    
    // Related concepts
    return 'related';
  };

  return (
    <div className="knowledge-map-container">
      <div className="knowledge-map-wrapper">
        <h1 className="knowledge-map-title">Chemistry Knowledge Map</h1>
        
        {/* <div className="knowledge-map-legend">
          {legendData.map((item) => (
            <div key={item.group} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div> */}
        
        <div className="zoom-instructions">
          <p>Use mouse wheel to zoom, drag to pan, or use the zoom controls on the left</p>
        </div>
        
        <svg ref={svgRef} className="knowledge-map-svg"></svg>
      </div>
    </div>
  );
};

export default KnowledgeMap; 