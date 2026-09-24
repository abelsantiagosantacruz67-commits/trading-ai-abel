import React, { useState } from 'react';
import { Maximize2, BarChart2, Eye, Sliders } from 'lucide-react';

export default function ChartView({ symbol, name, candles = [], currentPrice, marketType, feedSource, realExchange, realStats, payout }) {
  const [timeframe, setTimeframe] = useState('1m');
  const [showIndicators, setShowIndicators] = useState(true);

  if (!candles || candles.length === 0) {
    return (
      <div className="bg-[#0a0e17] border border-[#1c2333] p-6 h-[460px] flex items-center justify-center text-slate-500">
        Cargando datos del mercado real mundial en tiempo real...
      </div>
    );
  }

  // Dimensiones del gráfico
  const width = 760;
  const height = 360;
  const padding = { top: 20, right: 75, bottom: 35, left: 15 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Tomamos las últimas 36 velas y sincronizamos la vela actual con el precio en vivo
  const visibleCandles = candles.slice(-36).map((c, idx, arr) => {
    if (idx === arr.length - 1 && currentPrice) {
      return {
        ...c,
        close: currentPrice,
        high: Math.max(c.high || currentPrice, currentPrice),
        low: Math.min(c.low || currentPrice, currentPrice)
      };
    }
    return c;
  });
  
  // Rangos de precios dinámicos
  const minPrice = Math.min(...visibleCandles.map(c => c.low)) * 0.9997;
  const maxPrice = Math.max(...visibleCandles.map(c => c.high)) * 1.0003;
  const priceRange = maxPrice - minPrice || 1;

  const candleSpacing = chartWidth / visibleCandles.length;
  const candleBodyWidth = Math.max(4, candleSpacing * 0.7);

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

  // Generamos etiquetas de tiempo para el eje X
  const timeLabels = [];
  const now = new Date();
  for (let i = 0; i <= 4; i++) {
    const idx = Math.floor((visibleCandles.length - 1) * (i / 4));
    if (visibleCandles[idx]) {
      const x = padding.left + idx * candleSpacing + candleSpacing / 2;
      let intervalMs = 60000;
      if (timeframe === '5s') intervalMs = 5000;
      if (timeframe === '15s') intervalMs = 15000;
      if (timeframe === '30s') intervalMs = 30000;
      if (timeframe === '5m') intervalMs = 300000;
      
      const time = new Date(now.getTime() - (visibleCandles.length - 1 - idx) * intervalMs);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: timeframe.includes('s') ? '2-digit' : undefined });
      
      timeLabels.push({ x, timeStr });
    }
  }

  const displaySource = feedSource || (
    symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('SOL') || symbol.includes('XRP') || symbol.includes('BNB') || symbol.includes('DOGE')
      ? 'Binance Global Spot (24/7 Live Stream)'
      : symbol.includes('XAU') || symbol.includes('GOLD')
      ? 'COMEX New York Gold Spot / Fut'
      : symbol.includes('EUR') || symbol.includes('GBP') || symbol.includes('JPY')
      ? 'London Interbank FX Live'
      : symbol.includes('WTI') || symbol.includes('BRENT')
      ? 'NYMEX / ICE Energy Spot'
      : 'NASDAQ / Wall Street Real-Time'
  );

  const getAssetIcon = (type, sym) => {
    if (type === 'crypto' || sym.includes('BTC') || sym.includes('ETH')) return '₿';
    if (type === 'forex' || sym.includes('EUR') || sym.includes('USD')) return '💱';
    if (sym.includes('XAU') || sym.includes('GOLD')) return '🥇';
    if (sym.includes('US30') || sym.includes('NAS')) return '📊';
    return '📈';
  };

  const assetIcon = getAssetIcon(marketType, symbol);
  const isJpyOrIndex = symbol.includes('JPY') || symbol.includes('US30');
  const formattedCurrentPrice = currentPrice ? currentPrice.toFixed(isJpyOrIndex ? 2 : 5) : '0.00000';

  return (
    <div className="bg-[#0a0e17] border border-[#1c2333] p-0 shadow-2xl flex flex-col justify-between font-sans overflow-hidden">
      {/* Controles y Cabecera del Gráfico */}
      <div className="px-4 py-3 border-b border-[#1c2333] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl bg-[#1c2333] p-1.5 rounded-md leading-none">{assetIcon}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white tracking-wide">{symbol}</span>
                  {payout && (
                    <span className="text-[11px] font-bold text-[#00c853] bg-[#00c853]/10 px-1.5 py-0.5 rounded">
                      {payout}%
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">{name}</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col ml-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Precio Actual</span>
              <span className="text-2xl font-bold text-white font-mono leading-none">${formattedCurrentPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timeframes estilo IQ Option */}
            <div className="flex items-center gap-1">
              {['5s', '15s', '30s', '1m', '5m'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-semibold transition relative ${
                    timeframe === tf
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tf}
                  {timeframe === tf && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00c853] shadow-[0_0_8px_#00c853]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`p-1.5 border transition rounded ${
                showIndicators
                  ? 'border-[#00c853]/30 text-[#00c853] bg-[#00c853]/5'
                  : 'border-[#1c2333] text-slate-500 hover:text-slate-400'
              }`}
              title="Alternar Medias Móviles"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Info Feed y Stats */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c853]"></span>
            </span>
            <span className="text-[#00c853] font-bold tracking-wider">EN VIVO</span>
          </div>
          <div className="w-px h-3 bg-[#1c2333]"></div>
          <span className="font-mono text-slate-400">{displaySource}</span>
          
          {realStats && (
            <>
              <div className="w-px h-3 bg-[#1c2333]"></div>
              <div className="flex items-center gap-3 font-mono">
                {realStats.high && <span>H: <span className="text-slate-300">${realStats.high}</span></span>}
                {realStats.low && <span>L: <span className="text-slate-300">${realStats.low}</span></span>}
                {realStats.change != null && (
                  <span className={realStats.change >= 0 ? 'text-[#00c853]' : 'text-[#ff1744]'}>
                    {realStats.change >= 0 ? '+' : ''}{realStats.change.toFixed(2)}%
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Área del Gráfico SVG de Velas Japonesas */}
      <div className="relative w-full overflow-hidden select-none bg-[#0a0e17] cursor-crosshair">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block"
          style={{ minHeight: '360px' }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c853" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#0a0e17" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gradiente de fondo sutil */}
          <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#chartGradient)" />

          {/* Rejilla de Fondo Horizontal */}
          {priceLevels.map((p, i) => {
            const y = getY(p);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1c2333"
                  strokeWidth="1"
                />
              </g>
            );
          })}
          
          {/* Rejilla vertical y etiquetas de tiempo */}
          {timeLabels.map((t, i) => (
            <g key={`t-${i}`}>
              <line
                x1={t.x}
                y1={padding.top}
                x2={t.x}
                y2={height - padding.bottom}
                stroke="#1c2333"
                strokeWidth="1"
              />
              <text
                x={t.x}
                y={height - padding.bottom + 20}
                fill="#546a87"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {t.timeStr}
              </text>
            </g>
          ))}

          {/* Eje Y de Precios (Fondo a la derecha) */}
          <rect x={width - padding.right} y={0} width={padding.right} height={height} fill="#0a0e17" opacity="0.9" />
          <line x1={width - padding.right} y1={0} x2={width - padding.right} y2={height} stroke="#1c2333" strokeWidth="1" />

          {priceLevels.map((p, i) => {
            const y = getY(p);
            return (
              <text
                key={`p-${i}`}
                x={width - padding.right + 8}
                y={y + 4}
                fill="#546a87"
                fontSize="10"
                fontFamily="monospace"
              >
                {p.toFixed(isJpyOrIndex ? 2 : 5)}
              </text>
            );
          })}

          {/* Línea de EMA Dinámica */}
          {showIndicators && (
            <polyline
              fill="none"
              stroke="#00acc1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={emaPoints}
              opacity="0.6"
            />
          )}

          {/* Velas Japonesas (Candlesticks) */}
          {visibleCandles.map((c, idx) => {
            const xCenter = padding.left + idx * candleSpacing + candleSpacing / 2;
            const isGreen = c.close >= c.open;
            // Colores IQ Option
            const candleColor = isGreen ? '#00c853' : '#ff1744';

            const yOpen = getY(c.open);
            const yClose = getY(c.close);
            const yHigh = getY(c.high);
            const yLow = getY(c.low);

            const bodyY = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen)); // No rounded corners

            return (
              <g key={idx} className="transition-all duration-100">
                {/* Mecha superior e inferior delgada */}
                <line
                  x1={xCenter}
                  y1={yHigh}
                  x2={xCenter}
                  y2={yLow}
                  stroke={candleColor}
                  strokeWidth="1"
                />
                {/* Cuerpo de la vela cuadrado */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={bodyY}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={candleColor}
                />
              </g>
            );
          })}

          {/* Línea horizontal del precio actual con etiqueta a la derecha */}
          {currentPrice && (
            <g>
              {/* Línea punteada que cruza el gráfico */}
              <line
                x1={padding.left}
                y1={getY(currentPrice)}
                x2={width - padding.right}
                y2={getY(currentPrice)}
                stroke="#00c853"
                strokeWidth="1.5"
                strokeDasharray="2 4"
              />
              
              {/* Fondo del precio destacado en el eje Y */}
              <polygon
                points={`
                  ${width - padding.right},${getY(currentPrice)}
                  ${width - padding.right + 6},${getY(currentPrice) - 11}
                  ${width},${getY(currentPrice) - 11}
                  ${width},${getY(currentPrice) + 11}
                  ${width - padding.right + 6},${getY(currentPrice) + 11}
                `}
                fill="#00c853"
                filter="url(#glow)"
              />
              <polygon
                points={`
                  ${width - padding.right},${getY(currentPrice)}
                  ${width - padding.right + 6},${getY(currentPrice) - 11}
                  ${width},${getY(currentPrice) - 11}
                  ${width},${getY(currentPrice) + 11}
                  ${width - padding.right + 6},${getY(currentPrice) + 11}
                `}
                fill="#00c853"
              />
              
              {/* Texto del precio actual en el eje Y */}
              <text
                x={width - padding.right + 10}
                y={getY(currentPrice) + 4}
                fill="#0a0e17"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {currentPrice.toFixed(isJpyOrIndex ? 2 : 5)}
              </text>
            </g>
          )}
        </svg>

        {/* Leyenda de Indicadores */}
        {showIndicators && (
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="text-[10px] font-mono flex items-center gap-1 text-[#00acc1]">
              <span className="w-3 h-px bg-[#00acc1]" /> EMA 9
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
