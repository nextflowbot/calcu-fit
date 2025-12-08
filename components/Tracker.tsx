import React, { useState } from 'react';
import { useApp } from '../App';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Droplet, Utensils, Camera, Sparkles, Loader2, X } from 'lucide-react';
import { User, FoodRecord, WaterRecord } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

export const Tracker: React.FC = () => {
  const { user, updateUser } = useApp();
  
  // Food State
  const [foodName, setFoodName] = useState('');
  const [kcal, setKcal] = useState('');
  const [carbs, setCarbs] = useState('');
  const [prot, setProt] = useState('');
  const [fat, setFat] = useState('');
  
  // AI State
  const [analyzing, setAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  // Water State
  const [waterMl, setWaterMl] = useState('');

  if (!user) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithAI = async () => {
    if (!foodName && !image) {
      alert('Por favor, descreva o alimento ou envie uma foto para análise.');
      return;
    }

    setAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [];
      
      // Prompt construction
      let promptText = "Analise este alimento e estime os valores nutricionais para uma porção média padrão.";
      if (foodName) {
        promptText += ` Contexto adicional do usuário: "${foodName}".`;
      }
      parts.push({ text: promptText });

      // Image attachment
      if (image) {
        // Extract base64 and mime type
        const mimeType = image.split(';')[0].split(':')[1];
        const base64Data = image.split(',')[1];
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Short, descriptive name of the food in Portuguese" },
              kcal: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER, description: "Carbohydrates in grams" },
              protein: { type: Type.NUMBER, description: "Protein in grams" },
              fat: { type: Type.NUMBER, description: "Fat in grams" }
            }
          }
        }
      });

      const data = JSON.parse(response.text);

      if (data) {
        setFoodName(data.name || foodName);
        setKcal(String(Math.round(data.kcal || 0)));
        setCarbs(String(Math.round(data.carbs || 0)));
        setProt(String(Math.round(data.protein || 0)));
        setFat(String(Math.round(data.fat || 0)));
        
        // Optional: clear image after successful analysis to clean up UI
        // setImage(null); 
      }

    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Não foi possível analisar o alimento. Tente novamente ou preencha manualmente.");
    } finally {
      setAnalyzing(false);
    }
  };

  const addFood = () => {
    if (!foodName || !kcal) {
      alert('Preencha nome e calorias');
      return;
    }

    const newFood: FoodRecord = {
      id: uuidv4(),
      name: foodName,
      kcal: Number(kcal),
      carbs: Number(carbs) || 0,
      protein: Number(prot) || 0,
      fat: Number(fat) || 0,
      date: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      records: {
        ...user.records,
        food: [...user.records.food, newFood]
      }
    };

    updateUser(updatedUser);
    
    // Reset form
    setFoodName('');
    setKcal('');
    setCarbs('');
    setProt('');
    setFat('');
    setImage(null);
  };

  const addWater = () => {
    if (!waterMl) return;
    
    const newWater: WaterRecord = {
      id: uuidv4(),
      ml: Number(waterMl),
      date: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      records: {
        ...user.records,
        water: [...user.records.water, newWater]
      }
    };

    updateUser(updatedUser);
    setWaterMl('');
  };

  const removeFood = (id: string) => {
    const updatedUser = {
      ...user,
      records: {
        ...user.records,
        food: user.records.food.filter(f => f.id !== id)
      }
    };
    updateUser(updatedUser);
  };

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Registrar</h2>

      {/* Food Form */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
             <Utensils size={20} />
          </div>
          <h3 className="font-semibold text-gray-700">Refeição</h3>
        </div>

        <div className="space-y-3">
          {/* AI Input Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Descreva ou use foto..."
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
              />
              <label className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-primary cursor-pointer active:scale-90 transition-transform">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Camera size={20} className={image ? "text-primary fill-current" : ""} />
              </label>
            </div>
            <button 
              onClick={analyzeWithAI}
              disabled={analyzing}
              className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[50px]"
              title="Analisar com IA"
            >
              {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            </button>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImage(null)} 
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Manual/Auto-filled Inputs */}
          <div className="flex gap-3">
             <input 
              type="number"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Kcal"
              value={kcal}
              onChange={e => setKcal(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="C (g)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-sm outline-none" value={carbs} onChange={e => setCarbs(e.target.value)} />
            <input type="number" placeholder="P (g)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-sm outline-none" value={prot} onChange={e => setProt(e.target.value)} />
            <input type="number" placeholder="G (g)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-sm outline-none" value={fat} onChange={e => setFat(e.target.value)} />
          </div>

          <button 
            onClick={addFood}
            className="w-full bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={18} /> Adicionar Alimento
          </button>
        </div>
      </section>

      {/* Water Form */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-500">
             <Droplet size={20} fill="currentColor" />
          </div>
          <h3 className="font-semibold text-gray-700">Hidratação</h3>
        </div>
        
        <div className="flex gap-3">
           <input 
              type="number"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400/20"
              placeholder="ml"
              value={waterMl}
              onChange={e => setWaterMl(e.target.value)}
            />
            <button 
              onClick={addWater}
              className="bg-blue-500 text-white px-6 rounded-xl font-medium active:scale-95 transition-transform"
            >
              +
            </button>
        </div>
      </section>

      {/* Daily List */}
      <h3 className="font-bold text-gray-700 mb-3">Registros de Hoje</h3>
      <div className="space-y-3">
        {user.records.food.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">Nenhum alimento registrado ainda.</p>
        )}
        {[...user.records.food].reverse().map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 flex justify-between items-center group">
            <div>
              <p className="font-bold text-slate-800">{item.name}</p>
              <div className="text-xs text-gray-500 flex gap-2 mt-1">
                <span className="font-medium text-primary">{item.kcal} kcal</span>
                <span>•</span>
                <span>C: {item.carbs}g</span>
                <span>P: {item.protein}g</span>
                <span>G: {item.fat}g</span>
              </div>
            </div>
            <button 
              onClick={() => removeFood(item.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};