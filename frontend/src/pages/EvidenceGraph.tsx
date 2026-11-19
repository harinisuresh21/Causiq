import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Network,
  Cpu,
  GitCommit,
  Server,
  RefreshCw,
  AlertTriangle,
  Layers,
  Activity,
  Terminal,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

interface EvidenceNodeData {
  label: string;
  service: string;
  source: string;
  description: string;
  severity: string;
  timestamp: string;
  is_simulated: boolean;
  [key: string]: unknown;
}

// Custom interactive Node Component for React Flow
const EvidenceNodeComponent: React.FC<NodeProps<Node<EvidenceNodeData>>> = ({ data, selected }) => {
  const isCritical = data.severity === 'critical' || data.severity === 'error';
  const isWarning = data.severity === 'warning';

  function getNodeIcon() {
    switch (data.source) {
      case 'github': return GitCommit;
      case 'cloudwatch': return Server;
      case 'docker': return RefreshCw;
      case 'jenkins': return Terminal;
      default: return AlertTriangle;
    }
  }

  const Icon = getNodeIcon();

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all w-72 backdrop-blur-md cursor-pointer ${
        selected
          ? 'bg-[#18233c] border-violet-500 shadow-xl shadow-violet-500/25 ring-2 ring-violet-500/50'
          : 'bg-[#111726]/95 border-[#1f2b48] hover:border-gray-500'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-violet-400 !w-2.5 !h-2.5" />
      
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isCritical ? 'bg-rose-500/20 text-rose-400' : isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">{data.label}</div>
            <div className="text-[10px] text-gray-400 font-mono">{data.service}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
              isCritical
                ? 'bg-rose-500/20 text-rose-300'
                : isWarning
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-cyan-500/20 text-cyan-300'
            }`}
          >
            {data.severity.toUpperCase()}
          </span>
          {data.is_simulated && (
            <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1 py-0.5 rounded font-mono">
              DEMO
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-gray-300 leading-snug line-clamp-2 mt-1">
        {data.description}
      </p>

      <div className="mt-2 pt-1.5 border-t border-[#1e2a44] flex items-center justify-between text-[9px] text-gray-500 font-mono">
        <span>{data.source.toUpperCase()}</span>
        <span>{new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !w-2.5 !h-2.5" />
    </div>
  );
};

export const EvidenceGraph: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<EvidenceNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeData, setSelectedNodeData] = useState<EvidenceNodeData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({ evidenceNode: EvidenceNodeComponent }), []);

  useEffect(() => {
    async function load() {
      try {
        const incList = await api.getIncidents();
        setIncidents(incList);
        const urlId = searchParams.get('id');
        const highlightId = searchParams.get('highlight');

        const activeId = urlId || (incList.length > 0 ? incList[0].id : '');
        setSelectedIncidentId(activeId);

        if (activeId) {
          await loadGraph(activeId, highlightId);
        }
      } catch (err) {
        console.error('Failed to load evidence graph:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  async function loadGraph(id: string, highlightId?: string | null) {
    try {
      const graphData = await api.getEvidenceGraph(id);
      const formattedNodes: Node<EvidenceNodeData>[] = (graphData.nodes || []).map((n: any) => ({
        id: n.id,
        type: 'evidenceNode',
        position: n.position || { x: 100, y: 100 },
        data: n.data
      }));

      const formattedEdges: Edge[] = (graphData.edges || []).map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        label: e.label || 'Correlated',
        labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0c1220', rx: 4, ry: 4 }
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);

      if (highlightId) {
        const match = formattedNodes.find((n) => n.id === highlightId);
        if (match) {
          setSelectedNodeData(match.data);
          setSelectedNodeId(match.id);
        }
      } else if (formattedNodes.length > 0) {
        setSelectedNodeData(formattedNodes[0].data);
        setSelectedNodeId(formattedNodes[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const onNodeClick = useCallback((_: any, node: Node<EvidenceNodeData>) => {
    setSelectedNodeData(node.data);
    setSelectedNodeId(node.id);
  }, []);

  async function handleIncidentChange(id: string) {
    setSelectedIncidentId(id);
    await loadGraph(id);
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-[#1e2a44] bg-[#0d1322] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-violet-400" />
          <h1 className="text-sm font-bold text-white">Interactive Evidence Relationship Graph</h1>
          <select
            value={selectedIncidentId}
            onChange={(e) => handleIncidentChange(e.target.value)}
            className="bg-[#131b2f] border border-[#233152] rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-violet-500 ml-2"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.title.slice(0, 40)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            <span>{nodes.length} Correlated Nodes (React Flow Dynamic Graph)</span>
          </span>
          <span className="text-[11px] text-gray-500 font-mono">Drag nodes • Pan canvas • Click to inspect</span>
        </div>
      </div>

      {/* Main Flow Canvas & Side Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 bg-[#070b14] relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            className="bg-[#070b14]"
          >
            <Background color="#1e293b" gap={20} size={1} variant={BackgroundVariant.Dots} />
            <Controls className="!bg-[#111726] !border-[#1f2b48] !fill-gray-300" />
          </ReactFlow>
        </div>

        {/* Right Inspector Drawer */}
        <div className="w-96 border-l border-[#1e2a44] bg-[#0c1220] p-6 overflow-y-auto shrink-0 space-y-6">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            Evidence Inspector
          </h3>

          {selectedNodeData ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400">{selectedNodeId}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      selectedNodeData.severity === 'critical' || selectedNodeData.severity === 'error'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {selectedNodeData.severity.toUpperCase()}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Event Source & Service</div>
                  <div className="text-xs font-semibold text-white">
                    {selectedNodeData.source.toUpperCase()} → {selectedNodeData.service}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Timestamp</div>
                  <div className="text-xs font-mono text-gray-300">{selectedNodeData.timestamp}</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Raw Telemetry Description</div>
                  <p className="text-xs font-mono text-gray-200 mt-1 leading-relaxed bg-[#090d16] p-2.5 rounded border border-[#1e2a44]">
                    {selectedNodeData.description}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Why Event is Relevant</div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    This event establishes temporal and causal correlation within the failure blast radius, directly impacting downstream dependencies.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-10">Select a node in the graph to inspect evidence attributes.</div>
          )}
        </div>
      </div>
    </div>
  );
};
