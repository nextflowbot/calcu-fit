import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Screen } from '../types';
import { Home, PlusCircle, User as UserIcon, BookOpen, Clock } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setScreen, screen } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Date: "Quarta-feira, 24 de Outubro"
  const dateString = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Format Time: "14:30"
  const timeString = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format Seconds: "45"
  const secondsString = currentTime.toLocaleTimeString('pt-BR', {
    second: '2-digit'
  });

  const navItems = [
    { id: Screen.HOME, icon: Home, label: 'Início' },
    { id: Screen.TRACKER, icon: PlusCircle, label: 'Registrar' },
    { id: Screen.RECIPES, icon: BookOpen, label: 'Receitas' },
    { id: Screen.PROFILE, icon: UserIcon, label: 'Perfil' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background shadow-2xl overflow-hidden relative">
      
      {/* Date & Time Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">
            {dateString.split(',')[0]}
          </span>
          <span className="text-xs text-gray-500 font-medium capitalize">
            {dateString.split(',')[1]}
          </span>
        </div>
        
        <div className="flex items-baseline gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
          <Clock size={14} className="text-primary mr-1 self-center" />
          <span className="text-xl font-bold text-slate-800 tabular-nums tracking-tight">
            {timeString}
          </span>
          <span className="text-sm font-semibold text-primary/80 tabular-nums w-5">
            {secondsString}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${
                isActive ? 'text-primary translate-y-[-2px]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};