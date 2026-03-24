import React, { useState, useEffect } from 'react';
import ClusterMap from '../components/ClusterMap';

const MyFarmsPage = () => {
    const [farms, setFarms] = useState([]);
    const [newFarm, setNewFarm] = useState({ name: '', areaAcres: '' });
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false); // Bottom sheet state

    // Mock User ID
    const userId = 1;

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/farms/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setFarms(data);
            }
        } catch (error) {
            console.error("Error fetching farms:", error);
        }
    };

    const handleLocationSelect = (latlng) => {
        setSelectedLocation(latlng);
        setIsSheetOpen(true); // Open sheet when user pins a location
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLocation) {
            alert("No location selected!");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                name: newFarm.name,
                areaAcres: parseFloat(newFarm.areaAcres),
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng
            };
            const response = await fetch(`http://localhost:8080/api/farms?userId=${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setNewFarm({ name: '', areaAcres: '' });
                setSelectedLocation(null);
                setIsSheetOpen(false);
                fetchFarms();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-gray-100 overflow-hidden font-sans">
            {/* Full Screen Map */}
            <div className="absolute inset-0 z-0">
                <ClusterMap
                    farms={farms}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                    className="h-full w-full"
                />
            </div>

            {/* Floating Header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 pointer-events-auto flex items-center gap-2">
                    <span className="font-bold text-gray-800">Your Lands</span>
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{farms.length}</span>
                </div>
            </div>

            {/* Bottom Sheet Action (Add Farm) */}
            {!isSheetOpen && !selectedLocation && (
                <div className="absolute bottom-6 right-6 z-10">
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center"
                    >
                        <span className="text-2xl">➕</span>
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-80 pointer-events-none">
                        Tap map to pin location
                    </div>
                </div>
            )}

            {/* Sliding Bottom Sheet */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.1)] z-20 transition-transform duration-300 ease-out transform ${isSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '80vh' }}
            >
                {/* Drag Handle */}
                <div
                    className="w-full h-8 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsSheetOpen(!isSheetOpen)}
                >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(80vh-2rem)]">
                    {/* Dynamic Content: Form or List */}
                    {selectedLocation ? (
                        // Form View (When adding)
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">New Farm Details</h2>
                                <button onClick={() => { setSelectedLocation(null); }} className="text-sm text-red-500 font-bold">Cancel</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Farm Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-100 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g. South Field"
                                        value={newFarm.name}
                                        onChange={e => setNewFarm({ ...newFarm, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Size (Acres)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-100 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-green-500"
                                        placeholder="0.0"
                                        value={newFarm.areaAcres}
                                        onChange={e => setNewFarm({ ...newFarm, areaAcres: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition"
                                >
                                    {loading ? 'Adding...' : 'Add Farm'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        // List View (Default)
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold">Your Portfolio</h2>
                                <button onClick={() => setIsSheetOpen(false)} className="text-2xl text-gray-400">×</button>
                            </div>
                            {farms.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p>Tap the map to add your first land.</p>
                                </div>
                            ) : (
                                farms.map(farm => (
                                    <div key={farm.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{farm.name}</h3>
                                            <p className="text-sm text-gray-500">{farm.areaAcres} Acres</p>
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                            Active
                                        </div>
                                    </div>
                                ))
                            )}
                            <button
                                onClick={() => setIsSheetOpen(false)}
                                className="w-full mt-4 py-3 text-gray-500 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyFarmsPage;
