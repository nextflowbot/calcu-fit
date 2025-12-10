import React, { useMemo, useState } from 'react';
import { useApp } from '../App';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  AreaChart, Area 
} from 'recharts';
import { Flame, Droplet, TrendingUp, CalendarDays } from 'lucide-react';

export const Reports: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'kcal' | 'water'>('kcal');

  const weeklyData = useMemo(() => {
    if (!user) return [];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    });

    return last7Days.map(date => {
      // Find records matching this date (checking YYYY-MM-DD part)
      const dailyFood = user.records.food.filter(f => f.date.startsWith(date));
      const dailyWater = user.records.water.filter(w => w.date.startsWith(date));

      const totalKcal = dailyFood.reduce((sum, f) => sum + f.kcal, 0);
      const totalWater = dailyWater.reduce((sum, w) => sum + w.ml, 0);
      
      const dayLabel = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });

      return {
        date,
        day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1, 3), // e.g., "Seg"
        kcal: totalKcal,
        water: totalWater,
        goalKcal: user.settings.calorieGoal,
        goalWater: user.settings.waterGoal
      };
    });
  }, [user]);

  const stats = useMemo(() => {
    const totalKcal = weeklyData.reduce((acc, curr) => acc + curr.kcal, 0);
    const totalWater = weeklyData.reduce((acc, curr) => acc + curr.water, 0);
    return {
      avgKcal: Math.round(totalKcal / 7),
      avgWater: Math.round(totalWater / 7)
    };
  }, [weeklyData]);

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="font-bold text-slate-700 mb-1">{label}</p>
          <p className={`text-sm font-semibold ${activeTab === 'kcal' ? 'text-primary' : 'text-blue-500'}`}>
            {payload[0].value} {activeTab === 'kcal' ? 'kcal' : 'ml'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Sua Evolução</h2>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <TrendingUp size={14} />
          <span>7 Dias</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab('kcal')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'kcal' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Flame size={16} className={activeTab === 'kcal' ? 'text-orange-500' : 'text-gray-400'} fill={activeTab === 'kcal' ? 'currentColor' : 'none'} />
          Calorias
        </button>
        <button
          onClick={() => setActiveTab('water')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'water' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Droplet size={16} className={activeTab === 'water' ? 'text-blue-500' : 'text-gray-400'} fill={activeTab === 'water' ? 'currentColor' : 'none'} />
          Hidratação
        </button>
      </div>

      {/* Chart Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-80">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Média Diária</p>
            <p className="text-2xl font-bold text-slate-800">
              {activeTab === 'kcal' ? stats.avgKcal : stats.avgWater} 
              <span className="text-sm font-medium text-gray-400 ml-1">
                {activeTab === 'kcal' ? 'kcal' : 'ml'}
              </span>
            </p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-400 font-medium">Meta</p>
             <p className="text-sm font-bold text-primary">
                {activeTab === 'kcal' ? user?.settings.calorieGoal : user?.settings.waterGoal}
             </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="75%">
          {activeTab === 'kcal' ? (
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar 
                dataKey="kcal" 
                fill="#6c5ce7" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          ) : (
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="water" 
                stroke="#60a5fa" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWater)" 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
           <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={18} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-600 uppercase">Consistência</span>
           </div>
           <p className="text-sm text-orange-800 leading-snug">
             Você atingiu sua meta de calorias em <span className="font-bold">0 dias</span> esta semana.
           </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
           <div className="flex items-center gap-2 mb-2">
              <Droplet size={18} className="text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase">Hidratação</span>
           </div>
           <p className="text-sm text-blue-800 leading-snug">
             Mantenha-se hidratado para melhorar seu metabolismo e energia.
           </p>
        </div>
      </div>
    </div>
  );
};