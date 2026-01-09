import React, { useState, useEffect } from 'react';
import ClusterMap from '../components/ClusterMap';

const ClusterManagementPage = () => {
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

    useEffect(() => {
        fetchClusters();
    }, []);

    const fetchClusters = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/clusters');
            if (response.ok) {
                const data = await response.json();
                setClusters(data);
            }
        } catch (error) {
            console.error("Error fetching clusters:", error);
        }
    };

    const generateClusters = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/clusters/generate', {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                setClusters(data);
            } else {
                alert("Generation failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-gray-100 font-sans overflow-hidden">
            {/* Map Layer */}
            <div className={`absolute inset-0 z-0 ${viewMode === 'list' ? 'hidden' : 'block'}`}>
                <ClusterMap clusters={clusters} className="h-full w-full" />
            </div>

            {/* Header (Floating) */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                <div className="flex justify-between items-center pointer-events-auto">
                    <h1 className="text-white font-bold text-xl drop-shadow-md">Ops Center</h1>
                    <div className="flex bg-white/20 backdrop-blur rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-3 py-1 rounded text-xs font-bold transition ${viewMode === 'map' ? 'bg-white text-black' : 'text-white'}`}
                        >
                            Map
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded text-xs font-bold transition ${viewMode === 'list' ? 'bg-white text-black' : 'text-white'}`}
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>

            {/* List View Container */}
            {viewMode === 'list' && (
                <div className="absolute inset-0 z-0 bg-gray-50 pt-20 px-4 overflow-y-auto pb-24">
                    {clusters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p>No clusters generated yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {clusters.map(cluster => (
                                <div key={cluster.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-bold text-gray-800">{cluster.name}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${cluster.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {cluster.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 flex gap-4">
                                        <span>🚜 {cluster.farms ? cluster.farms.length : 0} Farms</span>
                                        <span>📅 {new Date(cluster.startDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Floating Action Button (Generate) */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
                <button
                    onClick={generateClusters}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    {loading ? (
                        <span className="animate-spin">⚙️ Processing...</span>
                    ) : (
                        <>⚡ Generate Optimization</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ClusterManagementPage;
