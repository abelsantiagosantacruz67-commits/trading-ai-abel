import WebSocket from 'ws';

export const REAL_ASSET_MAPPING = {
  // 1. BLITZ IQ OPTION (5s - 60s)
  'EURUSD-BLITZ': { type: 'yahoo', symbol: 'EURUSD=X', provider: 'IQ Option Blitz Stream (London FX)', exchange: 'IQ-BLITZ' },
  'GBPUSD-BLITZ': { type: 'yahoo', symbol: 'GBPUSD=X', provider: 'IQ Option Blitz Stream (London FX)', exchange: 'IQ-BLITZ' },
  'USDJPY-BLITZ': { type: 'yahoo', symbol: 'USDJPY=X', provider: 'IQ Option Blitz Stream (Tokyo FX)', exchange: 'IQ-BLITZ' },
  'AUDCAD-BLITZ': { type: 'yahoo', symbol: 'AUDCAD=X', provider: 'IQ Option Blitz Stream (Sydney/Toronto FX)', exchange: 'IQ-BLITZ' },
  'BTCUSD-BLITZ': { type: 'crypto', symbol: 'BTCUSDT', provider: 'Binance Micro-Tick Fast Stream', exchange: 'IQ-BLITZ' },
  'GOLD-BLITZ': { type: 'yahoo', symbol: 'GC=F', provider: 'COMEX Gold Blitz Fast Ticks', exchange: 'IQ-BLITZ' },
  'EURUSD-OTC-BLITZ': { type: 'otc', symbol: 'EURUSD=X', provider: 'IQ Option OTC Engine 24/7', exchange: 'IQ-OTC' },
  'GBPUSD-OTC-BLITZ': { type: 'otc', symbol: 'GBPUSD=X', provider: 'IQ Option OTC Engine 24/7', exchange: 'IQ-OTC' },

  // 2. DIGITAL IQ OPTION (1m - 15m)
  'DIGITAL-EURUSD': { type: 'yahoo', symbol: 'EURUSD=X', provider: 'IQ Option Digital Strike (London FX)', exchange: 'IQ-DIGITAL' },
  'DIGITAL-GBPUSD': { type: 'yahoo', symbol: 'GBPUSD=X', provider: 'IQ Option Digital Strike (London FX)', exchange: 'IQ-DIGITAL' },
  'DIGITAL-USDJPY': { type: 'yahoo', symbol: 'USDJPY=X', provider: 'IQ Option Digital Strike (Tokyo FX)', exchange: 'IQ-DIGITAL' },
  'DIGITAL-EURJPY': { type: 'yahoo', symbol: 'EURJPY=X', provider: 'IQ Option Digital Strike (EUR/JPY Cross)', exchange: 'IQ-DIGITAL' },
  'DIGITAL-AUDUSD': { type: 'yahoo', symbol: 'AUDUSD=X', provider: 'IQ Option Digital Strike (Sydney FX)', exchange: 'IQ-DIGITAL' },
  'DIGITAL-GBPJPY': { type: 'yahoo', symbol: 'GBPJPY=X', provider: 'IQ Option Digital Strike (GBP/JPY Cross)', exchange: 'IQ-DIGITAL' },
  'DIGITAL-EURUSD-OTC': { type: 'otc', symbol: 'EURUSD=X', provider: 'IQ Option OTC Digital 24/7', exchange: 'IQ-OTC' },
  'DIGITAL-GBPUSD-OTC': { type: 'otc', symbol: 'GBPUSD=X', provider: 'IQ Option OTC Digital 24/7', exchange: 'IQ-OTC' },

  // 3. FOREX IQ OPTION (CFD con Margen x50 - x1000)
  'EURUSD': { type: 'yahoo', symbol: 'EURUSD=X', provider: 'London Interbank FX Live', exchange: 'IQ-FOREX' },
  'GBPUSD': { type: 'yahoo', symbol: 'GBPUSD=X', provider: 'London Interbank FX Live', exchange: 'IQ-FOREX' },
  'USDJPY': { type: 'yahoo', symbol: 'USDJPY=X', provider: 'Tokyo / NY Interbank FX Live', exchange: 'IQ-FOREX' },
  'AUDUSD': { type: 'yahoo', symbol: 'AUDUSD=X', provider: 'Sydney Interbank FX Live', exchange: 'IQ-FOREX' },
  'USDCAD': { type: 'yahoo', symbol: 'USDCAD=X', provider: 'Toronto / NY Interbank FX Live', exchange: 'IQ-FOREX' },
  'EURGBP': { type: 'yahoo', symbol: 'EURGBP=X', provider: 'London Interbank FX Live', exchange: 'IQ-FOREX' },
  'NZDUSD': { type: 'yahoo', symbol: 'NZDUSD=X', provider: 'Wellington / NY Interbank FX', exchange: 'IQ-FOREX' },
  'EURUSD-OTC': { type: 'otc', symbol: 'EURUSD=X', provider: 'IQ Option OTC Forex 24/7', exchange: 'IQ-OTC' },

  // 4. ACCIONES CFD IQ OPTION (Stocks Wall Street x20)
  'TSLA': { type: 'yahoo', symbol: 'TSLA', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'AAPL': { type: 'yahoo', symbol: 'AAPL', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'NVDA': { type: 'yahoo', symbol: 'NVDA', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'AMZN': { type: 'yahoo', symbol: 'AMZN', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'MSFT': { type: 'yahoo', symbol: 'MSFT', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'META': { type: 'yahoo', symbol: 'META', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'NFLX': { type: 'yahoo', symbol: 'NFLX', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'GOOGL': { type: 'yahoo', symbol: 'GOOGL', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'AMD': { type: 'yahoo', symbol: 'AMD', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },

  // 5. ETF CFD IQ OPTION (Index Trackers x20)
  'SPY': { type: 'yahoo', symbol: 'SPY', provider: 'NYSE Arca S&P 500 ETF Live', exchange: 'NYSE' },
  'QQQ': { type: 'yahoo', symbol: 'QQQ', provider: 'NASDAQ Tech 100 ETF Live', exchange: 'NASDAQ' },
  'DIA': { type: 'yahoo', symbol: 'DIA', provider: 'NYSE Arca Dow Jones ETF', exchange: 'NYSE' },
  'XLF': { type: 'yahoo', symbol: 'XLF', provider: 'NYSE Arca Financial Select ETF', exchange: 'NYSE' },
  'EEM': { type: 'yahoo', symbol: 'EEM', provider: 'NYSE Arca Emerging Markets ETF', exchange: 'NYSE' },

  // 6. ÍNDICES CFD IQ OPTION (Global Indices x50 - x150)
  'US30': { type: 'yahoo', symbol: '^DJI', provider: 'Dow Jones 30 Wall Street', exchange: 'DJI' },
  'NAS100': { type: 'yahoo', symbol: '^IXIC', provider: 'NASDAQ 100 Tech Live', exchange: 'NASDAQ' },
  'SPX500': { type: 'yahoo', symbol: '^GSPC', provider: 'S&P 500 Wall Street Real-Time', exchange: 'S&P' },
  'GER40': { type: 'yahoo', symbol: '^GDAXI', provider: 'DAX 40 Deutsche Börse Frankfurt', exchange: 'XETRA' },
  'UK100': { type: 'yahoo', symbol: '^FTSE', provider: 'FTSE 100 London Stock Exchange', exchange: 'LSE' },
  'NIKKEI225': { type: 'yahoo', symbol: '^N225', provider: 'Nikkei 225 Tokyo Stock Exchange', exchange: 'TSE' },

  // 7. MATERIAS PRIMAS CFD IQ OPTION (Commodities x20 - x100)
  'XAUUSD': { type: 'yahoo', symbol: 'GC=F', provider: 'COMEX New York Gold Real-Time', exchange: 'COMEX' },
  'WTI': { type: 'yahoo', symbol: 'CL=F', provider: 'NYMEX WTI Light Sweet Crude', exchange: 'NYMEX' },
  'BRENT': { type: 'yahoo', symbol: 'BZ=F', provider: 'ICE Brent Crude North Sea', exchange: 'ICE' },
  'XAGUSD': { type: 'yahoo', symbol: 'SI=F', provider: 'COMEX New York Silver Real-Time', exchange: 'COMEX' },
  'NATGAS': { type: 'yahoo', symbol: 'NG=F', provider: 'Henry Hub Natural Gas NYMEX', exchange: 'NYMEX' },
  'PLATINUM': { type: 'yahoo', symbol: 'PL=F', provider: 'NYMEX Platinum Futures', exchange: 'NYMEX' },
  'GOLD-OTC': { type: 'otc', symbol: 'GC=F', provider: 'IQ Option OTC Gold 24/7', exchange: 'IQ-OTC' }
};

const TIMEFRAMES = {
  '5s': 5000,
  '15s': 15000,
  '30s': 30000,
  '1m': 60000,
  '5m': 300000
};

class RealMarketService {
  constructor() {
    this.latestPrices = {};
    this.smoothedPrices = {}; // Para el EMA
    this.marketStats = {};
    this.realCandles = {};
    this.basePrices = {}; // Precio de referencia subyacente para OTC
    this.otcPrices = {}; // Precio actual en simulación OTC
    this.wsClient = null;
    this.isReconnecting = false;
    this.lastYahooUpdate = 0;
  }

  init() {
    console.log('[IQ Option Stream Engine] Inicializando feeds de mercado mejorados...');
    this.initBinanceWebSocket();
    this.initYahooFinanceLoop();
    this.initOTCEngine();
  }

  initBinanceWebSocket() {
    try {
      // Find all unique crypto symbols
      const cryptoPairs = Object.values(REAL_ASSET_MAPPING)
        .filter(m => m.type === 'crypto')
        .map(m => m.symbol.toLowerCase());
      
      if (cryptoPairs.length === 0) return;

      const streams = [];
      for (const pair of cryptoPairs) {
        streams.push(`${pair}@trade`);
        streams.push(`${pair}@ticker`);
      }

      const url = `wss://stream.binance.com:9443/ws/${streams.join('/')}`;
      this.wsClient = new WebSocket(url);

      this.wsClient.on('open', () => {
        console.log('[IQ Option Stream Engine] WebSocket en vivo conectado para Crypto.');
      });

      this.wsClient.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          const symbolUpper = msg.s ? msg.s.toUpperCase() : null;
          
          if (!symbolUpper) return;

          // Find mapping keys for this symbol
          const assetKeys = Object.keys(REAL_ASSET_MAPPING).filter(k => REAL_ASSET_MAPPING[k].symbol === symbolUpper);

          if (msg.e === 'trade') {
            const price = parseFloat(msg.p);
            const volume = parseFloat(msg.q);
            for (const assetKey of assetKeys) {
              this.updateAssetPrice(assetKey, price, {
                volume,
                source: 'Binance Live Ticks',
                lastUpdate: Date.now()
              });
            }
          } else if (msg.e === '24hrTicker') {
            const changePercent = parseFloat(msg.P);
            const high = parseFloat(msg.h);
            const low = parseFloat(msg.l);
            const volume = parseFloat(msg.v);

            for (const assetKey of assetKeys) {
              this.marketStats[assetKey] = {
                ...this.marketStats[assetKey],
                changePercent,
                high24h: high,
                low24h: low,
                volume
              };
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      });

      this.wsClient.on('error', (err) => {
        console.warn('[IQ Option Stream Engine] Binance WS Error:', err.message);
      });

      this.wsClient.on('close', () => {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          setTimeout(() => {
            this.isReconnecting = false;
            this.initBinanceWebSocket();
          }, 3000); // Reconnect faster
        }
      });
    } catch (err) {
      console.warn('[IQ Option Stream Engine] Error inicializando Binance WS:', err.message);
    }
  }

  async initYahooFinanceLoop() {
    const fetchBatch = async () => {
      try {
        const uniqueSymbols = Array.from(new Set(
          Object.values(REAL_ASSET_MAPPING)
            .filter(m => m.type === 'yahoo' || m.type === 'otc')
            .map(m => m.symbol)
        ));

        if (uniqueSymbols.length === 0) return;

        // Try v8 spark endpoint first, which is faster and returns recent intervals
        const query = encodeURIComponent(uniqueSymbols.join(','));
        const v8Url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${query}&range=1d&interval=1m`;
        let pricesFetched = false;
        let resultsMap = {};

        try {
          const res = await fetch(v8Url, {
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.spark && data.spark.result) {
              for (const item of data.spark.result) {
                const meta = item.response[0].meta;
                const price = meta.regularMarketPrice;
                const previousClose = meta.chartPreviousClose;
                const changePercent = previousClose ? ((price - previousClose) / previousClose) * 100 : 0;
                
                if (price) {
                  resultsMap[item.symbol] = {
                    price,
                    changePercent,
                    high24h: price * 1.01, // Approx if not available
                    low24h: price * 0.99,
                    volume: 1000
                  };
                }
              }
              pricesFetched = Object.keys(resultsMap).length > 0;
            }
          }
        } catch (v8Err) {
          // ignore and fallback
        }

        // Fallback to v6 if v8 failed
        if (!pricesFetched) {
          const chunks = [];
          const chunkSize = 15;
          for (let i = 0; i < uniqueSymbols.length; i += chunkSize) {
            chunks.push(uniqueSymbols.slice(i, i + chunkSize));
          }

          for (const chunk of chunks) {
            const chunkQuery = encodeURIComponent(chunk.join(','));
            const v6Url = `https://query1.finance.yahoo.com/v6/finance/quote?symbols=${chunkQuery}`;
            try {
              const res = await fetch(v6Url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
              });
              if (res.ok) {
                const data = await res.json();
                const results = data?.quoteResponse?.result || [];
                for (const item of results) {
                  const price = item.regularMarketPrice;
                  if (price != null) {
                     resultsMap[item.symbol] = {
                       price,
                       changePercent: item.regularMarketChangePercent || 0,
                       high24h: item.regularMarketDayHigh || price,
                       low24h: item.regularMarketDayLow || price,
                       volume: item.regularMarketVolume || 1000
                     };
                  }
                }
              }
            } catch (err) {}
          }
        }

        // Process resultsMap
        for (const [symbol, data] of Object.entries(resultsMap)) {
          // Find all mapping entries for this symbol
          for (const [assetKey, meta] of Object.entries(REAL_ASSET_MAPPING)) {
            if (meta.symbol === symbol) {
              if (meta.type === 'otc') {
                // Update base price for OTC engine, don't tick here
                this.basePrices[assetKey] = data.price;
              } else {
                this.updateAssetPrice(assetKey, data.price, {
                  changePercent: data.changePercent,
                  high24h: data.high24h,
                  low24h: data.low24h,
                  volume: data.volume,
                  source: meta.provider,
                  lastUpdate: Date.now()
                });
              }
            }
          }
        }

        this.lastYahooUpdate = Date.now();
      } catch (err) {
        console.warn('[IQ Option Stream Engine] Yahoo Finance Loop:', err.message);
      }
    };

    await fetchBatch();
    // Faster polling: 3 seconds instead of 6
    setInterval(fetchBatch, 3000);
  }

  calibrateToIQOption(rawPrice, assetKey) {
    const meta = REAL_ASSET_MAPPING[assetKey];
    if (!meta) return rawPrice;

    // Simulate IQ Option's spreads and markups
    let calibrated = rawPrice;

    if (assetKey.includes('EURUSD')) {
      // Small pip spread for major pairs (e.g., +0.00010)
      calibrated += 0.00010;
    } else if (assetKey.includes('JPY')) {
      calibrated += 0.015; // 1.5 pips
    } else if (meta.exchange === 'COMEX' || meta.exchange === 'NYMEX' || meta.exchange === 'ICE' || assetKey.includes('GOLD')) {
      // Markup of 0.05% for commodities
      calibrated = rawPrice * 1.0005;
    } else if (meta.exchange === 'DJI' || meta.exchange === 'S&P' || meta.exchange === 'NASDAQ') {
      // Tracking difference 0.02%
      calibrated = rawPrice * 1.0002;
    } else if (meta.type === 'yahoo' && meta.provider.includes('Stock')) {
      // Stocks are within 0.1%
      calibrated = rawPrice * 1.001;
    }

    return calibrated;
  }

  initOTCEngine() {
    // Generar ticks sintéticos y realistas cada 1 segundo para OTC
    setInterval(() => {
      for (const [assetKey, meta] of Object.entries(REAL_ASSET_MAPPING)) {
        if (meta.type === 'otc') {
          let basePrice = this.basePrices[assetKey] || this.latestPrices[assetKey] || 100;
          let currentPrice = this.otcPrices[assetKey];

          if (!currentPrice) {
            currentPrice = basePrice;
          }

          // Random walk con mean reversion
          // El precio se mueve aleatoriamente pero tiende a regresar al basePrice real
          const reversionStrength = 0.05;
          const randomWalk = (Math.random() - 0.5) * basePrice * 0.0004; // Micro-volatilidad del 0.04%
          
          const difference = basePrice - currentPrice;
          const meanReversion = difference * reversionStrength;

          currentPrice = currentPrice + randomWalk + meanReversion;
          this.otcPrices[assetKey] = currentPrice;

          this.updateAssetPrice(assetKey, currentPrice, {
            volume: Math.floor(Math.random() * 50) + 10,
            source: 'IQ Option OTC Engine',
            lastUpdate: Date.now()
          });
        }
      }
    }, 300);
  }

  updateAssetPrice(assetKey, rawPrice, meta = {}) {
    if (!rawPrice || isNaN(rawPrice)) return;

    // 1. Aplicar calibración IQ Option
    let calibratedPrice = this.calibrateToIQOption(rawPrice, assetKey);

    // 2. Aplicar Smoothing (EMA)
    let previousSmoothed = this.smoothedPrices[assetKey];
    if (!previousSmoothed) {
      previousSmoothed = calibratedPrice;
      this.smoothedPrices[assetKey] = calibratedPrice;
    }
    
    // EMA smoothing: factor de suavizado del 30% (reacciona rápido pero sin saltos abruptos)
    const smoothingFactor = 0.3;
    const finalPrice = Number(((calibratedPrice * smoothingFactor) + (previousSmoothed * (1 - smoothingFactor))).toFixed(5));
    this.smoothedPrices[assetKey] = finalPrice;

    this.latestPrices[assetKey] = finalPrice;
    this.marketStats[assetKey] = {
      ...(this.marketStats[assetKey] || {}),
      price: finalPrice,
      ...meta
    };

    // 3. Actualizar Multi-Timeframe Candles
    if (!this.realCandles[assetKey]) {
      this.realCandles[assetKey] = {
        '5s': [],
        '15s': [],
        '30s': [],
        '1m': [],
        '5m': []
      };
    }

    const now = Date.now();
    for (const [tfLabel, durationMs] of Object.entries(TIMEFRAMES)) {
      const candles = this.realCandles[assetKey][tfLabel];
      
      if (candles.length === 0) {
        // Pre-poblar 30 velas históricas coherentes ancladas directamente al precio en vivo
        let p = finalPrice;
        for (let i = 30; i >= 1; i--) {
          const varPct = (Math.random() - 0.499) * 0.0008;
          const open = p;
          const close = Number((open * (1 + varPct)).toFixed(5));
          const high = Number((Math.max(open, close) * (1 + Math.random() * 0.0004)).toFixed(5));
          const low = Number((Math.min(open, close) * (1 - Math.random() * 0.0004)).toFixed(5));
          candles.push({
            timestamp: now - (i * durationMs),
            open,
            high,
            low,
            close,
            volume: Math.floor(20 + Math.random() * 100)
          });
          p = close;
        }
        candles.push({
          timestamp: now,
          open: p,
          high: Math.max(p, finalPrice),
          low: Math.min(p, finalPrice),
          close: finalPrice,
          volume: meta.volume || 10
        });
      } else {
        const lastCandle = candles[candles.length - 1];
        
        // ¿La vela actual sigue siendo válida para este timeframe?
        const isSameCandle = now - lastCandle.timestamp < durationMs;

        if (isSameCandle) {
          lastCandle.close = finalPrice;
          if (finalPrice > lastCandle.high) lastCandle.high = finalPrice;
          if (finalPrice < lastCandle.low) lastCandle.low = finalPrice;
          lastCandle.volume += (meta.volume ? meta.volume * 0.1 : 1);
        } else {
          // Crear nueva vela
          candles.push({
            // Alinear el timestamp al intervalo
            timestamp: now - (now % durationMs),
            open: lastCandle.close,
            high: finalPrice > lastCandle.close ? finalPrice : lastCandle.close,
            low: finalPrice < lastCandle.close ? finalPrice : lastCandle.close,
            close: finalPrice,
            volume: meta.volume || 10
          });

          // Mantener un historial máximo de 100 velas
          if (candles.length > 100) candles.shift();
        }
      }
    }
  }

  getRealPrice(symbol) {
    return this.latestPrices[symbol] || null;
  }

  getRealStats(symbol) {
    return this.marketStats[symbol] || null;
  }

  getRealCandles(symbol) {
    // Por defecto, retorna 1m para compatibilidad
    return this.getRealCandlesByTimeframe(symbol, '1m');
  }

  getRealCandlesByTimeframe(symbol, timeframe) {
    if (this.realCandles[symbol] && this.realCandles[symbol][timeframe]) {
      return this.realCandles[symbol][timeframe];
    }
    return null;
  }
}

export const realMarketService = new RealMarketService();
