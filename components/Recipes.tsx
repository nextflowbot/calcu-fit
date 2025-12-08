import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Recipe } from '../types';

const INITIAL_CATEGORIES = ['Todas', 'Laticínios', 'Fibras', 'Proteína Alta', 'Frutas', 'Peixe'];

const SAMPLE_RECIPES: Recipe[] = [
  { id: '1', title: 'Hambúrguer de Grão', kcal: 240, tag: 'Laticínios', image: 'https://picsum.photos/200' },
  { id: '2', title: 'Salmão Grelhado', kcal: 450, tag: 'Peixe', image: 'https://picsum.photos/201' },
  { id: '3', title: 'Chá Gelado', kcal: 15, tag: 'Frutas', image: 'https://picsum.photos/202' },
  { id: '4', title: 'Salada Cesar', kcal: 320, tag: 'Fibras', image: 'https://picsum.photos/203' },
  { id: '5', title: 'Omelete Proteico', kcal: 180, tag: 'Proteína Alta', image: 'https://picsum.photos/204' },
];

export const Recipes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES);

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'Todas' || r.tag === selectedCat;
    return matchesSearch && matchesCat;
  });

  const addNewMock = () => {
    const newRecipe: Recipe = {
      id: Math.random().toString(),
      title: `Receita #${recipes.length + 1}`,
      kcal: Math.floor(Math.random() * 500) + 50,
      tag: 'Outros',
      image: `https://picsum.photos/200?random=${recipes.length}`
    };
    setRecipes([newRecipe, ...recipes]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Receitas</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar receita..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {INITIAL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              selectedCat === cat 
                ? 'bg-slate-800 text-white border-slate-800' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredRecipes.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-20 h-20 rounded-xl object-cover bg-gray-100"
            />
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-semibold text-primary">{item.kcal} kcal</span>
                <span>•</span>
                <span>{item.tag}</span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addNewMock}
        className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
      >
        + Adicionar Receita Customizada
      </button>
    </div>
  );
};