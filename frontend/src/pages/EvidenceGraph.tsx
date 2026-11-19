import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Network, ZoomIn, ZoomOut, ArrowRight, ShieldAlert, Cpu, GitCommit, Server, RefreshCw, Zap, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

interface GraphNode {
  id: string;
  type: string;
  data: {
    label: string;
    service: string;
    source: string;
    description: string;
    severity: string;
    timestamp: string;
    is_simulated: boolean;
  };
  position: { x: number; y: number };
}

export const EvidenceGraph: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);

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
          const graphData = await api.getEvidenceGraph(activeId);
          setNodes(graphData.nodes || []);
          if (highlightId) {
            const match = graphData.nodes?.find((n: GraphNode) => n.id === highlightId);
            if (match) setSelectedNode(match);
          } else if (graphData.nodes?.length > 0) {
            setSelectedNode(graphData.nodes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load evidence graph:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  async function handleIncidentChange(id: string) {
    setSelectedIncidentId(id);
    setLoading(true);
    try {
      const graphData = await api.getEvidenceGraph(id);
      setNodes(graphData.nodes || []);
      setSelectedNode(graphData.nodes?.[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getNodeIcon(source: string) {
    switch (source) {
      case 'github': return GitCommit;
      case 'cloudwatch': return Server;
      case 'docker': return RefreshCw;
      case 'jenkins': return Cpu;
      default: return AlertTriangle;
    }
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

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-violet-400"></span>
          <span>{nodes.length} Correlated Nodes</span>
        </div>
      </div>

      {/* Main Graph Area & Right Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 bg-[#090d16] p-8 overflow-y-auto relative flex flex-col items-center">
          <div className="w-full max-w-2xl space-y-4 py-4">
            {nodes.map((node, idx) => {
              const Icon = getNodeIcon(node.data.source);
              const isSelected = selectedNode?.id === node.id;
              const isCritical = node.data.severity === 'critical' || node.data.severity === 'error';

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`w-full p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18233c] border-violet-500 shadow-lg shadow-violet-500/20 scale-[1.02]'
                        : 'bg-[#111726] border-[#1f2b48] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">{node.data.label}</span>
                          <span className="text-[10px] text-gray-400 block font-mono">
                            {node.data.service} • {node.data.source.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2a44] text-violet-300 font-semibold">
                          {node.id}
                        </span>
                        {node.data.is_simulated && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                            DEMO
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {node.data.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#1e2a44] flex items-center justify-between text-[10px] text-gray-500">
                      <span>{new Date(node.data.timestamp).toLocaleTimeString()}</span>
                      <span className={`font-semibold ${isCritical ? 'text-rose-400' : 'text-gray-400'}`}>
                        {node.data.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  {idx < nodes.length - 1 && (
                    <div className="my-2 flex flex-col items-center text-violet-400/60">
                      <div className="h-6 w-0.5 bg-gradient-to-b from-violet-500 to-indigo-500"></div>
                      <div className="text-[10px] font-mono tracking-wide py-0.5 text-gray-400">
                        Preceded / Correlated
                      </div>
                      <div className="h-2 w-0.5 bg-indigo-500"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Drawer */}
        <div className="w-96 border-l border-[#1e2a44] bg-[#0c1220] p-6 overflow-y-auto shrink-0 space-y-6">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            Evidence Inspector
          </h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400">{selectedNode.id}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      selectedNode.data.severity === 'critical' || selectedNode.data.severity === 'error'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {selectedNode.data.severity.toUpperCase()}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Event Source & Service</div>
                  <div className="text-xs font-semibold text-white">
                    {selectedNode.data.source.toUpperCase()} → {selectedNode.data.service}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Timestamp</div>
                  <div className="text-xs font-mono text-gray-300">{selectedNode.data.timestamp}</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Raw Telemetry Description</div>
                  <p className="text-xs font-mono text-gray-200 mt-1 leading-relaxed bg-[#090d16] p-2.5 rounded border border-[#1e2a44]">
                    {selectedNode.data.description}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Why Event is Relevant</div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    This event establishes temporal and causal correlation within the failure blast radius, indicating downstream dependency disruption.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-10">Select a node to inspect evidence attributes.</div>
          )}
        </div>
      </div>
    </div>
  );
};
