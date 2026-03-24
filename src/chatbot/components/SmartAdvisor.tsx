import React, { useState } from 'react';
import { Sprout, CloudRain, Thermometer, Droplets, Wind, Loader2, ClipboardCheck } from 'lucide-react';
import { getAgriRecommendations, SoilData, WeatherData } from '../services/geminiService';
import Markdown from 'react-markdown';

export const SmartAdvisor = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const [soil, setSoil] = useState<SoilData>({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: ''
  });

  const [weather, setWeather] = useState<WeatherData>({
    temp: '30',
    rainfall: 'Low',
    humidity: '60',
    forecast: 'Sunny with occasional clouds'
  });

  const handleSoilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoil({ ...soil, [e.target.name]: e.target.value });
  };

  const handleWeatherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setWeather({ ...weather, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recommendations = await getAgriRecommendations(soil, weather);
      setResult(recommendations);
    } catch (error) {
      console.error(error);
      setResult("Error generating recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-earth-200">
        <h2 className="text-2xl font-serif text-leaf-800 mb-4">Smart Farm Advisor</h2>
        <p className="text-earth-600 mb-6">Enter your soil test results and local weather to get personalized farming advice.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Soil Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-leaf-700 font-semibold border-b border-earth-100 pb-2">
                <Sprout size={20} />
                <h3>Soil Test Results</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">pH Level</label>
                  <input 
                    type="text" name="ph" value={soil.ph} onChange={handleSoilChange}
                    placeholder="e.g. 6.5"
                    className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">Organic Matter</label>
                  <input 
                    type="text" name="organicMatter" value={soil.organicMatter} onChange={handleSoilChange}
                    placeholder="e.g. 2%"
                    className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">Nitrogen (N)</label>
                  <input 
                    type="text" name="nitrogen" value={soil.nitrogen} onChange={handleSoilChange}
                    placeholder="mg/kg"
                    className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">Phosphorus (P)</label>
                  <input 
                    type="text" name="phosphorus" value={soil.phosphorus} onChange={handleSoilChange}
                    placeholder="mg/kg"
                    className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Weather Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-leaf-700 font-semibold border-b border-earth-100 pb-2">
                <CloudRain size={20} />
                <h3>Local Weather</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">Temperature</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                    <input 
                      type="number" name="temp" value={weather.temp} onChange={handleWeatherChange}
                      className="w-full p-3 pl-10 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">Humidity (%)</label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                    <input 
                      type="number" name="humidity" value={weather.humidity} onChange={handleWeatherChange}
                      className="w-full p-3 pl-10 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-earth-500">Forecast / Rainfall</label>
                  <input 
                    type="text" name="forecast" value={weather.forecast} onChange={handleWeatherChange}
                    placeholder="e.g. Heavy rain expected in 2 days"
                    className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-leaf-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-leaf-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-leaf-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ClipboardCheck size={20} />}
            {loading ? "Generating Recommendations..." : "Get Tailored Recommendations"}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-earth-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="markdown-body">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};
