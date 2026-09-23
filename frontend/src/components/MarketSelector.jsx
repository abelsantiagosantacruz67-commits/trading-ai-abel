import React, { useState } from 'react';
import { 
  Zap, Cpu, DollarSign, TrendingUp, Layers, BarChart2, 
  Flame, Search, Clock, ShieldCheck, Sparkles, Filter 
} from 'lucide-react';

const ICON_MAP = {
  blitz: Zap,
  digital: Cpu,
  forex: DollarSign,
  acciones: TrendingUp,
  etf: Layers,
  indices: BarChart2,
  materias_primas: Flame
};

export default function MarketSelector({ markets, activeMarketKey, onSelectMarket, activeSymbol, onSelectSymbol }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'live', 'otc'
  const [searchTerm, setSearchTerm] = useState('');

  const activeMarket = markets[activeMarketKey];
  const ActiveIcon = ICON_MAP[activeMarketKey] || Zap;

  // Filtrar activos del mercado seleccionado
  const rawAssets = activeMarket?.assets || [];
  const filteredAssets = rawAssets.filter(asset => {
    if (filterMode === 'live' && asset.isOTC) return false;
    if (filterMode === 'otc' && !asset.isOTC) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* 1. Cabecera con Selector de los 7 Mercados Oficiales de IQ Option */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Mercados de IQ Option
            </h3>
            <p className="text-[11px] text-slate-400">7 Instrumentos Oficiales en Tiempo Real</p>
          </div>
        </div>

        {/* Filtro: Mercado Regular vs OTC 24/7 */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-medium">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterMode === 'all'
                ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterMode('live')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
              filterMode === 'live'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            En Vivo
          </button>
          <button
            onClick={() => setFilterMode('otc')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
              filterMode === 'otc'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            OTC 24/7
          </button>
        </div>
      </div>

      {/* 2. Pestañas Horizontales de los 7 Mercados de IQ Option */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800/80 scrollbar-thin">
        {Object.entries(markets).map(([key, market]) => {
          const Icon = ICON_MAP[key] || Zap;
          const isSelected = key === activeMarketKey;

          return (
            <button
              key={key}
              onClick={() => {
                onSelectMarket(key);
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-850/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{market.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
              }`}>
                {market.assets?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Barra de búsqueda y descripción del mercado activo */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <ActiveIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">{activeMarket?.description}</span>
        </div>

        {/* Buscador de Activos */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar activo IQ Option..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* 4. Grilla de Activos Oficiales de IQ Option */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full py-6 text-center text-slate-500 text-xs">
            No se encontraron activos para los filtros seleccionados.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isCurrent = asset.symbol === activeSymbol;

            return (
              <button
                key={asset.symbol}
                onClick={() => onSelectSymbol(asset.symbol)}
                className={`p-2.5 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-slate-800/90 border-emerald-500/70 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/70 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`font-mono font-bold text-xs ${isCurrent ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {asset.symbol}
                    </span>
                    {asset.isOTC && (
                      <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        OTC
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate" title={asset.name}>
                    {asset.name}
                  </p>
                </div>

                {/* Badge de Payout de IQ Option o Multiplicador */}
                <div className="mt-2 pt-1.5 border-t border-slate-850 flex items-center justify-between text-[10px]">
                  {asset.payout ? (
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {asset.payout}% Payout
                    </span>
                  ) : asset.multiplier ? (
                    <span className="font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      {asset.multiplier}
                    </span>
                  ) : null}

                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-auto" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
