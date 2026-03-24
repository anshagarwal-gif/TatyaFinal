import React from 'react';
import { Download, Database, User, Calendar, MapPin, Sprout, FileText } from 'lucide-react';

interface UserDataPageProps {
  onBack: () => void;
}

export const UserDataPage = ({ onBack }: UserDataPageProps) => {
  // In a real app, this would come from a database or localStorage
  const [history] = React.useState([
    {
      id: 1,
      date: '2026-02-21',
      crop: 'Sugarcane',
      location: 'Satara',
      action: 'Diagnosis',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2026-02-20',
      crop: 'Cotton',
      location: 'Amravati',
      action: 'Advisory',
      status: 'Completed'
    }
  ]);

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tatya_user_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-earth-100 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-white border border-earth-200 rounded-xl font-bold text-earth-600 hover:bg-earth-50 transition-all"
          >
            ← चॅटकडे परत जा (Back)
          </button>
          <div className="flex gap-3">
            <button 
              onClick={exportData}
              className="flex items-center gap-2 px-6 py-2 bg-leaf-600 text-white rounded-xl font-bold hover:bg-leaf-700 transition-all shadow-lg shadow-leaf-100"
            >
              <Download size={18} /> डेटा एक्सपोर्ट करा (Export)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-earth-200 overflow-hidden">
          <div className="p-8 bg-leaf-50 border-b border-earth-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-leaf-600 rounded-2xl flex items-center justify-center text-white">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-leaf-900">वापरकर्ता डेटा आणि इतिहास</h2>
              <p className="text-leaf-600 font-medium">तुमच्या शेतीचे रेकॉर्ड आणि तात्यासोबतचा संवाद व्यवस्थापित करा</p>
            </div>
          </div>

          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-earth-100">
                  <th className="py-4 px-4 text-xs font-bold text-earth-400 uppercase tracking-widest">तारीख (Date)</th>
                  <th className="py-4 px-4 text-xs font-bold text-earth-400 uppercase tracking-widest">पीक (Crop)</th>
                  <th className="py-4 px-4 text-xs font-bold text-earth-400 uppercase tracking-widest">ठिकाण (Location)</th>
                  <th className="py-4 px-4 text-xs font-bold text-earth-400 uppercase tracking-widest">कृती (Action)</th>
                  <th className="py-4 px-4 text-xs font-bold text-earth-400 uppercase tracking-widest">स्थिती (Status)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-earth-50 hover:bg-earth-50 transition-colors group">
                    <td className="py-6 px-4 flex items-center gap-3">
                      <Calendar size={16} className="text-earth-300" />
                      <span className="font-medium text-earth-700">{item.date}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2">
                        <Sprout size={16} className="text-leaf-500" />
                        <span className="font-bold text-leaf-900">{item.crop}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-earth-400" />
                        <span className="text-earth-600">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.action === 'Diagnosis' ? "bg-leaf-100 text-leaf-700" : "bg-indigo-100 text-indigo-700"
                      )}>
                        {item.action === 'Diagnosis' ? 'निदान' : 'सल्ला'}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        पूर्ण (Completed)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-earth-200 shadow-sm">
            <h4 className="text-earth-400 font-bold uppercase text-[10px] tracking-widest mb-2">एकूण स्कॅन (Total Scans)</h4>
            <div className="text-4xl font-serif font-bold text-leaf-900">24</div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-earth-200 shadow-sm">
            <h4 className="text-earth-400 font-bold uppercase text-[10px] tracking-widest mb-2">सक्रिय पिके (Active Crops)</h4>
            <div className="text-4xl font-serif font-bold text-leaf-900">3</div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-earth-200 shadow-sm">
            <h4 className="text-earth-400 font-bold uppercase text-[10px] tracking-widest mb-2">यशस्वी दर (Success Rate)</h4>
            <div className="text-4xl font-serif font-bold text-leaf-900">92%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
