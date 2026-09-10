import React, { useState } from 'react';
import { 
  Zap, Cpu, DollarSign, TrendingUp, Layers, BarChart2, 
  Flame, Coins, Shield, Wheat, Landmark, Filter 
} from 'lucide-react';

const ICON_MAP = {
  blips: Zap,
  blitz: Zap,
  digital: Cpu,
  forex: DollarSign,
  crypto: Coins,
  acciones: TrendingUp,
  etf: Layers,
  indices: BarChart2,
  matif_prime: Flame,
  materias_primas: Flame,
  energias: Flame,
  metales: Shield,
  agricolas: Wheat,
  bonos: Landmark
};

const CATEGORIES = [
  { id: 'all', label: 'Todos (12)' },
  { id: 'turbo', label: '⚡ Blips & Digitales', keys: ['blips', 'digital'] },
  { id: 'cfd', label: '📈 Forex, Acciones & Índices', keys: ['forex', 'acciones', 'etf', 'indices'] },
  { id: 'crypto', label: '🪙 Crypto 24/7', keys: ['crypto'] },
  { id: 'commodities', label: '🌾 Materias Primas & MATIF', keys: ['matif_prime', 'energias', 'metales', 'agricolas'] },
  { id: 'bonds', label: '🏛️ Bonos Soberanos', keys: ['bonos'] }
];

export default function MarketSelector({ markets, activeMarketKey, onSelectMarket, activeSymbol, onSelectSymbol }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const activeMarket = markets[activeMarketKey];
  const ActiveIcon = ICON_MAP[activeMarketKey] || Zap;

  // Filtrado de mercados
  const filteredMarkets = Object.entries(markets).filter(([key]) => {
    if (selectedCategory === 'all') return true;
    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    return cat?.keys?.includes(key);
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* 0. Filtros rápidos de categoría */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 border-b border-slate-800/60 scrollbar-none text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3" /> Categorías:
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 1. Barra de Selección de los 12 Mercados */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {filteredMarkets.map(([key, market]) => {
          const Icon = ICON_MAP[key] || Zap;
          const isSelected = key === activeMarketKey;

          return (
            <button
              key={key}
              onClick={() => onSelectMarket(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-850/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{market.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
              }`}>
                {market.assets?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Información del Mercado Activo */}
      <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{activeMarket?.description}</span>
        </div>
        <span className="self-start md:self-auto px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/20 font-mono text-[11px]">
          {activeMarket?.badge}
        </span>
      </div>

      {/* 3. Selector de Activos del Mercado Activo */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {activeMarket?.assets.map((asset) => {
          const isCurrent = asset.symbol === activeSymbol;

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectSymbol(asset.symbol)}
              className={`p-2.5 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-800 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono font-bold text-xs ${isCurrent ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {asset.symbol}
                </span>
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate" title={asset.name}>
                {asset.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
