import React from 'react';
import { 
  TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, 
  Activity, Target, Clock, Lock, Sparkles, AlertTriangle, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

export default function AIPredictionCard({ prediction, currentPrice, requiresPaywall, onOpenPaywall, selectedStrategy = 'daytrading', onSelectStrategy }) {
  if (requiresPaywall) {
    return (
      <div className="relative bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center min-h-[420px]">
        {/* Fondo con efecto blur de datos bloqueados */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <Lock className="w-7 h-7 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Señales y Probabilidades Bloqueadas
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Tu periodo de prueba gratuita de <span className="text-amber-400 font-semibold">2 días (48 horas) ha finalizado</span>. Para seguir recibiendo las probabilidades matemáticas de compra/venta y señales cuantitativas de los 7 mercados, adquiere un plan de suscripción.
          </p>
          <button
            onClick={onOpenPaywall}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition transform hover:scale-105"
          >
            Ver Planes de Suscripción
          </button>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-center min-h-[420px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Activity className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium">Analizando estadísticas históricas del mercado...</p>
        </div>
      </div>
    );
  }

  const {
    symbol,
    name,
    marketType,
    probabilityUp,
    probabilityDown,
    recommendation,
    signalColor,
    confidence,
    estimatedHistoricalWinRate,
    technicalIndicators,
    executionDetails,
    reasoning
  } = prediction;

  const isBuy = probabilityUp >= probabilityDown;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {symbol} &bull; {marketType.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> IA Cuantitativa
              </span>
            </div>
            <h3 className="text-lg font-bold text-white truncate max-w-[280px]">
              {name}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Precio Actual</span>
            <span className="text-lg font-mono font-black text-slate-100">
              ${currentPrice || prediction.currentPrice}
            </span>
          </div>
        </div>

        {/* SELECTOR DE LAS 3 ESTRATEGIAS DE LA IA */}
        <div className="mt-3.5 mb-2.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectStrategy && onSelectStrategy('scalping')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
              selectedStrategy === 'scalping'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>⚡ Scalping Turbo</span>
            <span className="text-[10px] opacity-75 font-mono">(1-5m)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStrategy && onSelectStrategy('daytrading')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
              selectedStrategy === 'daytrading'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🎯 Day Trading</span>
            <span className="text-[10px] opacity-75 font-mono">(15m-1h)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStrategy && onSelectStrategy('swing_smc')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
              selectedStrategy === 'swing_smc'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🛡️ Swing SMC</span>
            <span className="text-[10px] opacity-75 font-mono">(4h-1D)</span>
          </button>
        </div>

        {/* Badge descriptivo de la estrategia activa */}
        {prediction?.strategy && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate pr-2">Estrategia: <strong className="text-white">{prediction.strategy.name}</strong></span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 border border-slate-750 shrink-0">
              {prediction.strategy.badge}
            </span>
          </div>
        )}

        {/* 1. Medidor Central de Probabilidades de Subida vs Bajada */}
        <div className="my-5 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2 font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>Probabilidad de SUBIDA (Comprar)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span>Probabilidad de BAJADA (Vender)</span>
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>

          {/* Gran porcentaje visual */}
          <div className="flex items-center justify-between font-mono font-black my-1">
            <span className="text-3xl text-emerald-400 drop-shadow-md">
              {probabilityUp}%
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400">
              vs
            </span>
            <span className="text-3xl text-rose-400 drop-shadow-md">
              {probabilityDown}%
            </span>
          </div>

          {/* Barra de balance visual */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex my-2 border border-slate-700/50">
            <div 
              style={{ width: `${probabilityUp}%` }}
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
            />
            <div 
              style={{ width: `${probabilityDown}%` }}
              className="bg-gradient-to-r from-rose-500 to-rose-700 transition-all duration-500"
            />
          </div>

          {/* Veredicto de la IA */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Recomendación IA:</span>
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg tracking-wide ${
                isBuy
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-green'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 glow-red'
              }`}>
                {recommendation}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400">Confianza:</span>
              <span className="font-semibold text-cyan-300">{confidence}</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-[11px] text-slate-400">WinRate:</span>
              <span className="font-mono font-bold text-amber-400">{estimatedHistoricalWinRate}%</span>
            </div>
          </div>
        </div>

        {/* 2. Parámetros de Ejecución Recomendados */}
        <div className="mb-4 bg-slate-850/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Niveles Sugeridos de Entrada
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {executionDetails?.type}
            </span>
          </div>

          {marketType === 'blips' || marketType === 'blitz' || marketType === 'digital' ? (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Expiración Óptima</span>
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {executionDetails?.recommendedExpiration}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Acción & Payout</span>
                <span className={`font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {executionDetails?.recommendedAction} ({executionDetails?.targetPayout})
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Stop Loss (SL)</span>
                <span className="font-bold text-rose-400">${executionDetails?.stopLoss}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Take Profit 1</span>
                <span className="font-bold text-emerald-400">${executionDetails?.takeProfit1}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Take Profit 2</span>
                <span className="font-bold text-teal-300">${executionDetails?.takeProfit2}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Razonamiento Cuantitativo & Confluencia de Indicadores */}
        <div className="text-xs">
          <span className="text-slate-400 font-semibold block mb-2">
            Justificación Estadística de la IA:
          </span>
          <div className="space-y-1.5">
            {reasoning?.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>

          {/* Mini tabla de métricas técnicas */}
          <div className="mt-3 grid grid-cols-4 gap-1.5 text-center font-mono text-[10px]">
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">RSI(14)</span>
              <span className={`font-bold ${technicalIndicators?.rsi > 70 ? 'text-rose-400' : technicalIndicators?.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {technicalIndicators?.rsi}
              </span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">EMA(9)</span>
              <span className="text-slate-300">{technicalIndicators?.ema9}</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">EMA(21)</span>
              <span className="text-slate-300">{technicalIndicators?.ema21}</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">ATR</span>
              <span className="text-amber-400">{technicalIndicators?.atr}</span>
            </div>
          </div>

          {/* Aviso de Gestión de Riesgo */}
          <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-start gap-1.5 leading-snug">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Aviso de Probabilidad:</strong> Las probabilidades señalan el escenario con mayor ventaja estadística. Los mercados financieros pueden experimentar volatilidad imprevista. Opere siempre con gestión de capital controlada.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
