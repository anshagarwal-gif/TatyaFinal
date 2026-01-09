import React, { useState, useEffect } from 'react';
import ClusterMap from '../components/ClusterMap';

const NearbyClustersPage = () => {
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        fetchActiveClusters();
    }, []);

    const fetchActiveClusters = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/clusters/active');
            if (response.ok) {
                const data = await response.json();
                setClusters(data);
            }
        } catch (error) {
            console.error("Error fetching active clusters:", error);
        }
    };

    return (
        <div className="relative h-screen w-full bg-gray-100 font-sans overflow-hidden">
            {/* Full Screen Map */}
            <div className="absolute inset-0 z-0">
                <ClusterMap clusters={clusters} className="h-full w-full" />
            </div>

            {/* Top Floating Search/Filter */}
            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-white shadow-lg rounded-full p-3 flex items-center gap-3">
                    <span className="text-gray-400 pl-2">🔍</span>
                    <input
                        type="text"
                        placeholder="Search nearby zones..."
                        className="bg-transparent outline-none w-full text-sm font-medium"
                    />
                </div>
            </div>

            {/* Bottom Horizontal Scroll List (Like Airbnb/Maps) */}
            <div className="absolute bottom-8 left-0 right-0 z-10 overflow-x-auto pl-4 pb-4 no-scrollbar">
                <div className="flex gap-4 pr-4" style={{ width: 'max-content' }}>
                    {clusters.length === 0 ? (
                        <div className="bg-white p-4 rounded-2xl shadow-xl w-[300px]">
                            <p className="text-gray-500 text-sm">No active service zones found nearby.</p>
                        </div>
                    ) : (
                        clusters.map(cluster => (
                            <div key={cluster.id} className="bg-white p-4 rounded-2xl shadow-xl w-[280px] border border-gray-100 snap-center">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 truncate">{cluster.name}</h3>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Open</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <span>📅</span>
                                    <span>{new Date(cluster.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <span>🚜</span>
                                    <span>{cluster.farms ? cluster.farms.length : 0} Farmers Joined</span>
                                </div>

                                <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm">
                                    Join Group
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NearbyClustersPage;
