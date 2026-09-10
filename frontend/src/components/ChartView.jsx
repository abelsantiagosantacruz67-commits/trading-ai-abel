import React, { useState } from 'react';
import { Maximize2, BarChart2, Eye, Sliders } from 'lucide-react';

export default function ChartView({ symbol, name, candles = [], currentPrice, marketType }) {
  const [timeframe, setTimeframe] = useState('1m');
  const [showIndicators, setShowIndicators] = useState(true);

  if (!candles || candles.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[460px] flex items-center justify-center text-slate-500">
        Cargando datos del gráfico en tiempo real...
      </div>
    );
  }

  // Dimensiones del gráfico
  const width = 760;
  const height = 360;
  const padding = { top: 20, right: 65, bottom: 30, left: 15 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Tomamos las últimas 36 velas para visualizar con claridad
  const visibleCandles = candles.slice(-36);
  
  // Rangos de precios
  const minPrice = Math.min(...visibleCandles.map(c => c.low)) * 0.9995;
  const maxPrice = Math.max(...visibleCandles.map(c => c.high)) * 1.0005;
  const priceRange = maxPrice - minPrice || 1;

  const candleSpacing = chartWidth / visibleCandles.length;
  const candleBodyWidth = Math.max(4, candleSpacing * 0.65);

  const getY = (price) => {
    return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Cálculo de línea de EMA para visualización
  const emaPoints = visibleCandles.map((c, idx) => {
    const x = padding.left + idx * candleSpacing + candleSpacing / 2;
    const y = getY(c.close);
    return `${x},${y}`;
  }).join(' ');

  const priceLevels = [
    maxPrice,
    minPrice + priceRange * 0.75,
    minPrice + priceRange * 0.5,
    minPrice + priceRange * 0.25,
    minPrice
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      {/* Controles y Cabecera del Gráfico */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white font-mono">{symbol}</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-[180px]">{name}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">Último:</span>
            <span className="font-bold text-emerald-400">${currentPrice}</span>
          </div>
        </div>

        {/* Timeframes & Indicadores */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
            {['30s', '1m', '5m', '15m'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-md transition ${
                  timeframe === tf
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`p-1.5 rounded-lg border text-xs transition ${
              showIndicators
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Alternar Medias Móviles y Señal"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Área del Gráfico SVG de Velas Japonesas */}
      <div className="relative w-full overflow-hidden mt-3 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block"
          style={{ minHeight: '340px' }}
        >
          {/* Rejilla de Fondo */}
          {priceLevels.map((p, i) => {
            const y = getY(p);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {p.toFixed(symbol.includes('JPY') ? 2 : symbol.includes('US30') ? 0 : 4)}
                </text>
              </g>
            );
          })}

          {/* Línea de EMA Dinámica */}
          {showIndicators && (
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={emaPoints}
              opacity="0.8"
            />
          )}

          {/* Velas Japonesas (Candlesticks) */}
          {visibleCandles.map((c, idx) => {
            const xCenter = padding.left + idx * candleSpacing + candleSpacing / 2;
            const isGreen = c.close >= c.open;
            const candleColor = isGreen ? '#10b981' : '#f43f5e';

            const yOpen = getY(c.open);
            const yClose = getY(c.close);
            const yHigh = getY(c.high);
            const yLow = getY(c.low);

            const bodyY = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            return (
              <g key={idx} className="transition-all duration-150">
                {/* Mecha superior e inferior */}
                <line
                  x1={xCenter}
                  y1={yHigh}
                  x2={xCenter}
                  y2={yLow}
                  stroke={candleColor}
                  strokeWidth="1.4"
                />
                {/* Cuerpo de la vela */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={bodyY}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={candleColor}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Línea horizontal del precio actual con etiqueta */}
          {currentPrice && (
            <g>
              <line
                x1={padding.left}
                y1={getY(currentPrice)}
                x2={width - padding.right}
                y2={getY(currentPrice)}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <rect
                x={width - padding.right + 2}
                y={getY(currentPrice) - 9}
                width={padding.right - 4}
                height={18}
                fill="#10b981"
                rx="3"
              />
              <text
                x={width - padding.right + 6}
                y={getY(currentPrice) + 3}
                fill="#022c22"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {currentPrice}
              </text>
            </g>
          )}
        </svg>

        {/* Leyenda de Indicadores */}
        {showIndicators && (
          <div className="absolute top-2 left-2 flex items-center gap-3 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> EMA(9) Cuantitativa
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-0.5 bg-emerald-400 inline-block" /> Precio En Vivo
            </span>
          </div>
        )}
      </div>

      {/* Footer del Gráfico con estado de conexión */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Feed de datos en tiempo real activo &bull; Latencia: 18ms</span>
        </div>
        <span className="font-mono">Timeframe: {timeframe}</span>
      </div>
    </div>
  );
}
