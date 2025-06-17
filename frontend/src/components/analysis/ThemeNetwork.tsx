'use client';

import { useEffect, useState, useRef } from 'react';

interface NetworkNode {
  id: string;
  label: string;
  size: number;
  category: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface NetworkLink {
  source: string;
  target: string;
  weight: number;
}

export function ThemeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    // Define theme network based on the stories
    const networkNodes: NetworkNode[] = [
      // Central storm-related themes
      { id: 'storm-response', label: 'Storm Response', size: 15, category: 'storm' },
      { id: 'community-support', label: 'Community Support', size: 18, category: 'community' },
      { id: 'infrastructure', label: 'Infrastructure', size: 12, category: 'infrastructure' },
      
      // Recovery & resilience themes
      { id: 'recovery', label: 'Recovery Programs', size: 10, category: 'recovery' },
      { id: 'mens-group', label: 'Men\'s Groups', size: 8, category: 'recovery' },
      { id: 'elder-wisdom', label: 'Elder Wisdom', size: 9, category: 'governance' },
      
      // Identity & culture themes
      { id: 'aboriginal-identity', label: 'Aboriginal Identity', size: 11, category: 'identity' },
      { id: 'cultural-preservation', label: 'Cultural Preservation', size: 10, category: 'identity' },
      { id: 'historical-trauma', label: 'Historical Trauma', size: 8, category: 'identity' },
      
      // Systems & governance
      { id: 'government-relations', label: 'Government Relations', size: 7, category: 'governance' },
      { id: 'community-justice', label: 'Community Justice', size: 6, category: 'governance' },
      { id: 'emergency-planning', label: 'Emergency Planning', size: 7, category: 'governance' },
      
      // Innovation & adaptation
      { id: 'innovation', label: 'Community Innovation', size: 9, category: 'community' },
      { id: 'adaptation', label: 'Climate Adaptation', size: 8, category: 'storm' },
      { id: 'self-sufficiency', label: 'Self-Sufficiency', size: 7, category: 'recovery' }
    ];

    // Define connections between themes
    const networkLinks: NetworkLink[] = [
      // Strong connections
      { source: 'storm-response', target: 'community-support', weight: 8 },
      { source: 'storm-response', target: 'infrastructure', weight: 7 },
      { source: 'community-support', target: 'recovery', weight: 6 },
      { source: 'community-support', target: 'elder-wisdom', weight: 5 },
      
      // Cultural connections
      { source: 'aboriginal-identity', target: 'cultural-preservation', weight: 7 },
      { source: 'aboriginal-identity', target: 'historical-trauma', weight: 6 },
      { source: 'elder-wisdom', target: 'cultural-preservation', weight: 6 },
      { source: 'elder-wisdom', target: 'community-justice', weight: 5 },
      
      // Recovery connections
      { source: 'recovery', target: 'mens-group', weight: 7 },
      { source: 'recovery', target: 'self-sufficiency', weight: 5 },
      { source: 'mens-group', target: 'community-support', weight: 4 },
      
      // Governance connections
      { source: 'government-relations', target: 'community-justice', weight: 4 },
      { source: 'emergency-planning', target: 'storm-response', weight: 6 },
      { source: 'emergency-planning', target: 'infrastructure', weight: 5 },
      
      // Innovation connections
      { source: 'innovation', target: 'adaptation', weight: 5 },
      { source: 'innovation', target: 'self-sufficiency', weight: 4 },
      { source: 'adaptation', target: 'storm-response', weight: 5 }
    ];

    setNodes(networkNodes);
    setLinks(networkLinks);
  }, []);

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') return;
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;

    // Organized cluster-based positions for better readability
    const categoryPositions = {
      storm: { centerX: width * 0.2, centerY: height * 0.3 },
      community: { centerX: width * 0.5, centerY: height * 0.2 },
      infrastructure: { centerX: width * 0.8, centerY: height * 0.3 },
      recovery: { centerX: width * 0.3, centerY: height * 0.7 },
      governance: { centerX: width * 0.7, centerY: height * 0.7 },
      identity: { centerX: width * 0.5, centerY: height * 0.5 }
    };

    const fixedNodes = nodes.map((node, index) => {
      const categoryNodes = nodes.filter(n => n.category === node.category);
      const nodeIndex = categoryNodes.findIndex(n => n.id === node.id);
      const totalInCategory = categoryNodes.length;
      
      const center = categoryPositions[node.category as keyof typeof categoryPositions] || 
                    { centerX: width * 0.5, centerY: height * 0.5 };
      
      // Arrange nodes in category in a small circle
      const angle = (nodeIndex / totalInCategory) * 2 * Math.PI;
      const radius = Math.min(40, totalInCategory * 8);
      
      return {
        ...node,
        x: center.centerX + Math.cos(angle) * radius,
        y: center.centerY + Math.sin(angle) * radius
      };
    });

    const drawNetwork = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw category group backgrounds
      const categoryColors = {
        storm: '#e74c3c',
        community: '#2ecc71',
        identity: '#f39c12',
        infrastructure: '#3498db',
        governance: '#9b59b6',
        recovery: '#1abc9c'
      };

      Object.entries(categoryPositions).forEach(([category, pos]) => {
        const categoryNodes = fixedNodes.filter(n => n.category === category);
        if (categoryNodes.length > 0) {
          ctx.beginPath();
          ctx.arc(pos.centerX, pos.centerY, 60, 0, 2 * Math.PI);
          ctx.fillStyle = `${categoryColors[category as keyof typeof categoryColors]}10`;
          ctx.fill();
          ctx.strokeStyle = `${categoryColors[category as keyof typeof categoryColors]}30`;
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw links with enhanced interactivity
      links.forEach(link => {
        const source = fixedNodes.find(n => n.id === link.source);
        const target = fixedNodes.find(n => n.id === link.target);
        if (source && target) {
          const isConnectedToSelected = selectedNode && 
            (link.source === selectedNode || link.target === selectedNode);
          const isConnectedToHovered = hoveredNode && 
            (link.source === hoveredNode || link.target === hoveredNode);
          
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          
          if (isConnectedToSelected) {
            ctx.strokeStyle = `${categoryColors[source.category as keyof typeof categoryColors]}`;
            ctx.lineWidth = Math.max(3, link.weight / 2);
          } else if (isConnectedToHovered) {
            ctx.strokeStyle = `rgba(100, 100, 100, 0.6)`;
            ctx.lineWidth = Math.max(2, link.weight / 3);
          } else {
            ctx.strokeStyle = `rgba(100, 100, 100, ${Math.min(0.3, link.weight / 20)})`;
            ctx.lineWidth = Math.max(1, link.weight / 5);
          }
          ctx.stroke();
        }
      });

      // Draw nodes with enhanced interactivity
      fixedNodes.forEach(node => {
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode === node.id;
        const isConnectedToSelected = selectedNode && links.some(link => 
          (link.source === selectedNode && link.target === node.id) ||
          (link.target === selectedNode && link.source === node.id)
        );
        
        const baseRadius = Math.max(12, node.size * 0.8);
        let radius = baseRadius;
        
        if (isSelected) radius = baseRadius + 8;
        else if (isHovered || isConnectedToSelected) radius = baseRadius + 4;

        // Node shadow for depth
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x + 2, node.y + 2, radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        const nodeColor = categoryColors[node.category as keyof typeof categoryColors] || '#95a5a6';
        
        if (isSelected) {
          ctx.fillStyle = nodeColor;
        } else if (isConnectedToSelected) {
          ctx.fillStyle = `${nodeColor}CC`;
        } else {
          ctx.fillStyle = nodeColor;
        }
        ctx.fill();

        // Border for selected/hovered/connected
        if (isSelected || isHovered || isConnectedToSelected) {
          ctx.strokeStyle = isSelected ? '#2c3e50' : nodeColor;
          ctx.lineWidth = isSelected ? 4 : 2;
          ctx.stroke();
        }

        // Node label with better positioning
        ctx.fillStyle = '#2c3e50';
        ctx.font = `${isSelected ? 'bold ' : ''}${isSelected ? '12' : '10'}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text background with better contrast
        const textWidth = ctx.measureText(node.label).width;
        const textHeight = 14;
        const textY = node.y + radius + 12;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.fillRect(node.x - textWidth/2 - 6, textY - textHeight/2, textWidth + 12, textHeight);
        ctx.strokeRect(node.x - textWidth/2 - 6, textY - textHeight/2, textWidth + 12, textHeight);

        ctx.fillStyle = isSelected ? nodeColor : '#2c3e50';
        ctx.fillText(node.label, node.x, textY);
      });
    };

    drawNetwork();

    // Handle mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let foundNode = null;
      for (const node of fixedNodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const baseRadius = Math.max(15, node.size);
        if (distance < baseRadius + 5) {
          foundNode = node.id;
          break;
        }
      }

      if (foundNode !== hoveredNode) {
        setHoveredNode(foundNode);
        canvas.style.cursor = foundNode ? 'pointer' : 'default';
        drawNetwork(); // Redraw only when hover state changes
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const node of fixedNodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const baseRadius = Math.max(15, node.size);
        if (distance < baseRadius + 5) {
          setSelectedNode(selectedNode === node.id ? null : node.id);
          return;
        }
      }

      setSelectedNode(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [nodes, links, hoveredNode, selectedNode]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #e9ecef',
          borderRadius: '8px'
        }}
      />
      
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '200px'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
            {nodes.find(n => n.id === selectedNode)?.label}
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
            Connected themes appear highlighted. Click to explore relationships.
          </p>
        </div>
      )}
      
      <div style={{
        marginTop: '1rem',
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center'
      }}>
        Click nodes to explore connections • Hover for details • Lines show theme relationships
      </div>
    </div>
  );
}