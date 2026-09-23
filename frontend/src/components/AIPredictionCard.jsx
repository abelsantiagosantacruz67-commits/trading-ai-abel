import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, 
  Activity, Target, Clock, Lock, Sparkles, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Zap, DollarSign, Percent
} from 'lucide-react';

export default function AIPredictionCard({ 
  prediction, 
  currentPrice, 
  requiresPaywall, 
  onOpenPaywall, 
  selectedStrategy = 'daytrading', 
  onSelectStrategy 
}) {
  const [investAmount, setInvestAmount] = useState(10); // $10 USD por defecto típico en IQ Option

  if (requiresPaywall) {
    return (
      <div className="relative bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center min-h-[460px]">
        {/* Fondo con efecto blur de datos bloqueados */}
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <Lock className="w-7 h-7 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Señales y Probabilidades Bloqueadas
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Tu periodo de prueba gratuita de <span className="text-amber-400 font-semibold">3 días (72 horas) ha finalizado</span>. Para seguir recibiendo las probabilidades matemáticas de compra/venta y señales en tiempo real de los 7 mercados de IQ Option, adquiere un plan de suscripción.
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-center min-h-[460px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Activity className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium">Conectando con algoritmo IQ Option & calculando probabilidades...</p>
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
  const payout = executionDetails?.payoutPercent || 92;
  const potentialProfit = ((investAmount * payout) / 100).toFixed(2);
  const totalReturn = (Number(investAmount) + Number(potentialProfit)).toFixed(2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Cabecera Oficial estilo IQ Option */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {symbol} &bull; {marketType.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> IA IQ Option
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Feed Oficial En Vivo
              </span>
            </div>
            <h3 className="text-lg font-bold text-white truncate max-w-[280px]">
              {name}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Precio Actual</span>
            <span className="text-lg font-mono font-black text-emerald-400">
              ${currentPrice || prediction.currentPrice}
            </span>
          </div>
        </div>

        {/* SELECTOR DE ESTRATEGIAS DE LA IA */}
        <div className="mt-3.5 mb-2.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectStrategy && onSelectStrategy('scalping')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
              selectedStrategy === 'scalping'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>⚡ Scalper Turbo (5s-1m)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStrategy && onSelectStrategy('daytrading')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
              selectedStrategy === 'daytrading'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🎯 Confluencia (5m-15m)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStrategy && onSelectStrategy('swing_smc')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
              selectedStrategy === 'swing_smc'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🛡️ SMC Institucional</span>
          </button>
        </div>

        {/* 1. Medidor Central de Probabilidades de Subida vs Bajada */}
        <div className="my-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2 font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>Probabilidad SUBE (Compra / Call)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span>Probabilidad BAJA (Venta / Put)</span>
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
              <span className="text-[11px] text-slate-400">Veredicto IA:</span>
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
              <span className="text-[11px] text-slate-400">WinRate Histórico:</span>
              <span className="font-mono font-bold text-amber-400">{estimatedHistoricalWinRate}%</span>
            </div>
          </div>
        </div>

        {/* 2. BOTONERA DE TRADING IDÉNTICA A IQ OPTION (SUBE / BAJA) */}
        <div className="my-4 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              Panel de Orden IQ Option
            </span>
            {marketType === 'blitz' || marketType === 'digital' ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/30">
                +{payout}% Rendimiento
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-bold text-[11px] border border-cyan-500/30">
                {executionDetails?.iqMultiplier || 'Multiplicador x1000'}
              </span>
            )}
          </div>

          {/* Parámetros de Expiración / Inversión */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">
                {marketType === 'blitz' || marketType === 'digital' ? 'Expiración IQ Option' : 'Apalancamiento'}
              </span>
              <span className="font-bold text-cyan-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                {executionDetails?.recommendedExpiration || executionDetails?.iqMultiplier}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Ingreso Estimado</span>
              <span className="font-bold text-emerald-400">
                +${potentialProfit} USD <span className="text-slate-400 font-normal">(${totalReturn})</span>
              </span>
            </div>
          </div>

          {/* LOS 2 BOTONES DE IQ OPTION: SUBE (VERDE) Y BAJA (ROJO) CON PROBABILIDAD DE LA IA */}
          <div className="grid grid-cols-2 gap-3">
            {/* Botón SUBE / CALL */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
              isBuy 
                ? 'bg-emerald-600/25 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/50' 
                : 'bg-slate-900/60 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center gap-1 text-emerald-400 font-black text-sm mb-0.5">
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                <span>SUBE (CALL)</span>
              </div>
              <span className="text-xl font-black font-mono text-emerald-300">
                {probabilityUp}%
              </span>
              <span className="text-[10px] text-emerald-400 font-medium mt-0.5">
                {isBuy ? 'Señal Recomendada' : 'Menor probabilidad'}
              </span>
            </div>

            {/* Botón BAJA / PUT */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
              !isBuy 
                ? 'bg-rose-600/25 border-rose-500 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/50' 
                : 'bg-slate-900/60 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center gap-1 text-rose-400 font-black text-sm mb-0.5">
                <ArrowDownRight className="w-4 h-4 stroke-[3]" />
                <span>BAJA (PUT)</span>
              </div>
              <span className="text-xl font-black font-mono text-rose-300">
                {probabilityDown}%
              </span>
              <span className="text-[10px] text-rose-400 font-medium mt-0.5">
                {!isBuy ? 'Señal Recomendada' : 'Menor probabilidad'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Niveles de Protección para CFDs o Puntos de Strike */}
        {marketType !== 'blitz' && marketType !== 'digital' && (
          <div className="mb-4 bg-slate-850/60 border border-slate-800 rounded-xl p-3">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              Niveles de Stop Loss & Take Profit IQ Option:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Stop Loss (-50%)</span>
                <span className="font-bold text-rose-400">${executionDetails?.stopLoss}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Take Profit (+120%)</span>
                <span className="font-bold text-emerald-400">${executionDetails?.takeProfit1}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Ratio R:B</span>
                <span className="font-bold text-teal-300">{executionDetails?.riskRewardRatio}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Razonamiento Cuantitativo & Confluencia de Indicadores */}
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
        </div>
      </div>
    </div>
  );
}
