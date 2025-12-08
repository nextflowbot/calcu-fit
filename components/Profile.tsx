import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { LogOut, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useApp();
  
  const [name, setName] = useState('');
  const [calGoal, setCalGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCalGoal(String(user.settings.calorieGoal));
      setWaterGoal(String(user.settings.waterGoal));
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    if (!name) return;

    const updatedUser = {
      ...user,
      name,
      settings: {
        calorieGoal: Number(calGoal) || 2000,
        waterGoal: Number(waterGoal) || 2000
      }
    };
    
    updateUser(updatedUser);
    setMsg('Perfil salvo com sucesso!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Perfil</h2>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
          <input 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Meta de Calorias (kcal)</label>
          <input 
            type="number"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={calGoal}
            onChange={e => setCalGoal(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Meta de Água (ml)</label>
          <input 
            type="number"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={waterGoal}
            onChange={e => setWaterGoal(e.target.value)}
          />
        </div>

        {msg && <p className="text-green-500 text-sm font-medium text-center">{msg}</p>}

        <button 
          onClick={handleSave}
          className="w-full bg-primary text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primaryDark transition-colors"
        >
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <button 
        onClick={logout}
        className="mt-6 w-full bg-red-50 text-red-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} /> Sair da conta
      </button>

      <p className="text-center text-gray-300 text-xs mt-8">CalcuFit v1.0.0 Web</p>
    </div>
  );
};