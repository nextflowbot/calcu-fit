import React, { useMemo } from 'react';
import { useApp } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Droplet, Flame } from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useApp();

  const stats = useMemo(() => {
    if (!user) return { kcal: 0, water: 0, carbs: 0, protein: 0, fat: 0 };
    
    // In a real app, you'd filter by today's date
    // const today = new Date().toISOString().split('T')[0];
    // const foods = user.records.food.filter(f => f.date.startsWith(today));
    
    // For demo simplicity (as per prompt), we sum all records
    const foods = user.records.food;
    const water = user.records.water;

    return {
      kcal: foods.reduce((sum, f) => sum + (f.kcal || 0), 0),
      carbs: foods.reduce((sum, f) => sum + (f.carbs || 0), 0),
      protein: foods.reduce((sum, f) => sum + (f.protein || 0), 0),
      fat: foods.reduce((sum, f) => sum + (f.fat || 0), 0),
      water: water.reduce((sum, w) => sum + (w.ml || 0), 0),
    };
  }, [user]);

  const macroData = [
    { name: 'Carbs', value: stats.carbs, color: '#fca5a5' }, // red-300
    { name: 'Prot', value: stats.protein, color: '#86efac' }, // green-300
    { name: 'Fat', value: stats.fat, color: '#fde047' }, // yellow-300
  ];
  
  // Prevent empty chart rendering issues
  const chartData = stats.carbs + stats.protein + stats.fat === 0 
    ? [{ name: 'Empty', value: 1, color: '#e5e7eb' }] 
    : macroData;

  const kcalGoal = user?.settings.calorieGoal || 2000;
  const waterGoal = user?.settings.waterGoal || 2000;
  const kcalProgress = Math.min((stats.kcal / kcalGoal) * 100, 100);
  const waterProgress = Math.min((stats.water / waterGoal) * 100, 100);

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, {user?.name} 👋</h1>
          <p className="text-gray-500 text-sm">Vamos alcançar suas metas hoje?</p>
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-xl overflow-hidden border-2 border-white shadow-sm">
          👤
        </div>
      </header>

      {/* Main Stats Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-gray-500 font-medium mb-4">Resumo do dia</h2>
        
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-4xl font-bold text-slate-800">{stats.kcal}</span>
            <span className="text-gray-400 text-sm ml-1">/ {kcalGoal} kcal</span>
          </div>
          <Flame className="text-orange-500 mb-1" size={24} fill="currentColor" />
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500" 
            style={{ width: `${kcalProgress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-3xl font-bold text-slate-800">{stats.water}</span>
            <span className="text-gray-400 text-sm ml-1">/ {waterGoal} ml</span>
          </div>
          <Droplet className="text-blue-400 mb-1" size={24} fill="currentColor" />
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-blue-400 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${waterProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Macros Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 w-full text-left">Macros</h3>
            <div className="h-32 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-xs text-gray-400 font-medium">g</span>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-gray-500 mt-2">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-300"></div> C</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-300"></div> P</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-300"></div> G</span>
            </div>
        </div>

        {/* Quick tip or empty state */}
        <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10 flex flex-col justify-between">
           <div>
             <h3 className="text-primary font-bold mb-1">Dica Fit</h3>
             <p className="text-primaryDark/70 text-xs leading-relaxed">
               Beba um copo de água antes de cada refeição para melhorar a digestão.
             </p>
           </div>
           <div className="self-end">
              <span className="text-2xl">🥑</span>
           </div>
        </div>
      </div>
    </div>
  );
};