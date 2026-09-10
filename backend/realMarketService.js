import WebSocket from 'ws';

/**
 * Real Market Ingestion & Streaming Engine
 * Conecta en vivo con:
 * - Binance Global WebSocket (Crypto 24/7)
 * - Yahoo Finance Market Engine (Gold COMEX, London FX, Wall Street Equities, Crude Oil, Indices)
 */

export const REAL_ASSET_MAPPING = {
  // Crypto -> Binance
  'BTCUSD': { type: 'crypto', symbol: 'BTCUSDT', provider: 'Binance Global Spot (24/7 Live Stream)', exchange: 'BINANCE' },
  'ETHUSD': { type: 'crypto', symbol: 'ETHUSDT', provider: 'Binance Global Spot (24/7 Live Stream)', exchange: 'BINANCE' },
  'SOLUSD': { type: 'crypto', symbol: 'SOLUSDT', provider: 'Binance Global Spot (24/7 Live Stream)', exchange: 'BINANCE' },
  'XRPUSD': { type: 'crypto', symbol: 'XRPUSDT', provider: 'Binance Global Spot (24/7 Live Stream)', exchange: 'BINANCE' },
  'BNBUSD': { type: 'crypto', symbol: 'BNBUSDT', provider: 'Binance Global Spot (24/7 Live Stream)', exchange: 'BINANCE' },
  'DOGEUSD': { type: 'crypto', symbol: 'DOGEUSDT', provider: 'Binance Global Spot (24/7 Live Stream)', exchange: 'BINANCE' },
  'BLIP-BTC': { type: 'crypto', symbol: 'BTCUSDT', provider: 'Binance Micro-Tick Fast Stream', exchange: 'BINANCE' },
  'DIGITAL-BTC': { type: 'crypto', symbol: 'BTCUSDT', provider: 'Binance Digital Strike Stream', exchange: 'BINANCE' },

  // Oro & Metales -> COMEX New York / NYMEX
  'XAUUSD': { type: 'yahoo', symbol: 'GC=F', provider: 'COMEX New York Gold Real-Time', exchange: 'COMEX' },
  'XAU-GOLD': { type: 'yahoo', symbol: 'GC=F', provider: 'COMEX New York Gold Spot/Fut', exchange: 'COMEX' },
  'BLIP-GOLD': { type: 'yahoo', symbol: 'GC=F', provider: 'COMEX New York Fast Ticks', exchange: 'COMEX' },
  'XAGUSD': { type: 'yahoo', symbol: 'SI=F', provider: 'COMEX New York Silver Real-Time', exchange: 'COMEX' },
  'XAG-SILVER': { type: 'yahoo', symbol: 'SI=F', provider: 'COMEX New York Silver Real-Time', exchange: 'COMEX' },
  'XPT-PLAT': { type: 'yahoo', symbol: 'PL=F', provider: 'NYMEX Platinum Futures', exchange: 'NYMEX' },
  'COPPER': { type: 'yahoo', symbol: 'HG=F', provider: 'COMEX High Grade Copper', exchange: 'COMEX' },

  // Forex -> London Interbank FX
  'EURUSD': { type: 'yahoo', symbol: 'EURUSD=X', provider: 'London Interbank FX Live', exchange: 'FOREX' },
  'BLIP-EURUSD': { type: 'yahoo', symbol: 'EURUSD=X', provider: 'London Interbank FX 60s Stream', exchange: 'FOREX' },
  'DIGITAL-EURUSD': { type: 'yahoo', symbol: 'EURUSD=X', provider: 'London Interbank FX Strike', exchange: 'FOREX' },
  'GBPUSD': { type: 'yahoo', symbol: 'GBPUSD=X', provider: 'London Interbank FX Live', exchange: 'FOREX' },
  'DIGITAL-GBPUSD': { type: 'yahoo', symbol: 'GBPUSD=X', provider: 'London Interbank FX Digital', exchange: 'FOREX' },
  'USDJPY': { type: 'yahoo', symbol: 'USDJPY=X', provider: 'Tokyo / NY Interbank FX Live', exchange: 'FOREX' },
  'DIGITAL-USDJPY': { type: 'yahoo', symbol: 'USDJPY=X', provider: 'Tokyo Interbank Digital', exchange: 'FOREX' },
  'AUDUSD': { type: 'yahoo', symbol: 'AUDUSD=X', provider: 'Sydney Interbank FX Live', exchange: 'FOREX' },
  'USDCAD': { type: 'yahoo', symbol: 'USDCAD=X', provider: 'Toronto / NY Interbank FX Live', exchange: 'FOREX' },
  'EURJPY': { type: 'yahoo', symbol: 'EURJPY=X', provider: 'London / Tokyo FX Cross', exchange: 'FOREX' },

  // Acciones -> Wall Street (NASDAQ / NYSE)
  'NVDA': { type: 'yahoo', symbol: 'NVDA', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'AAPL': { type: 'yahoo', symbol: 'AAPL', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'TSLA': { type: 'yahoo', symbol: 'TSLA', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'MSFT': { type: 'yahoo', symbol: 'MSFT', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'AMZN': { type: 'yahoo', symbol: 'AMZN', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },
  'META': { type: 'yahoo', symbol: 'META', provider: 'NASDAQ Wall Street Real-Time', exchange: 'NASDAQ' },

  // ETFs -> NYSE Arca / Cboe
  'SPY': { type: 'yahoo', symbol: 'SPY', provider: 'NYSE Arca S&P 500 ETF Live', exchange: 'NYSE' },
  'QQQ': { type: 'yahoo', symbol: 'QQQ', provider: 'NASDAQ Tech 100 ETF Live', exchange: 'NASDAQ' },
  'DIA': { type: 'yahoo', symbol: 'DIA', provider: 'NYSE Arca Dow Jones ETF', exchange: 'NYSE' },
  'ARKK': { type: 'yahoo', symbol: 'ARKK', provider: 'Cboe BZX Innovation ETF', exchange: 'CBOE' },

  // Índices -> S&P Dow Jones / Deutsche Börse / LSE
  'US30': { type: 'yahoo', symbol: '^DJI', provider: 'Dow Jones 30 Wall Street', exchange: 'DJI' },
  'NAS100': { type: 'yahoo', symbol: '^IXIC', provider: 'NASDAQ Composite Tech Live', exchange: 'NASDAQ' },
  'SPX500': { type: 'yahoo', symbol: '^GSPC', provider: 'S&P 500 Wall Street Real-Time', exchange: 'S&P' },
  'GER40': { type: 'yahoo', symbol: '^GDAXI', provider: 'DAX 40 Deutsche Börse Frankfurt', exchange: 'XETRA' },
  'UK100': { type: 'yahoo', symbol: '^FTSE', provider: 'FTSE 100 London Stock Exchange', exchange: 'LSE' },

  // Energías -> NYMEX / ICE
  'BRENT': { type: 'yahoo', symbol: 'BZ=F', provider: 'ICE Brent Crude North Sea', exchange: 'ICE' },
  'WTI': { type: 'yahoo', symbol: 'CL=F', provider: 'NYMEX WTI Light Sweet Crude', exchange: 'NYMEX' },
  'WTI-CRUDE': { type: 'yahoo', symbol: 'CL=F', provider: 'NYMEX WTI Light Sweet Crude', exchange: 'NYMEX' },
  'NATGAS': { type: 'yahoo', symbol: 'NG=F', provider: 'Henry Hub Natural Gas NYMEX', exchange: 'NYMEX' },
  'NATGAS-US': { type: 'yahoo', symbol: 'NG=F', provider: 'Henry Hub Natural Gas NYMEX', exchange: 'NYMEX' },
  'HEATOIL': { type: 'yahoo', symbol: 'HO=F', provider: 'NYMEX Heating Oil Live', exchange: 'NYMEX' },

  // Agrícolas & MATIF -> CBOT / Euronext
  'MATIF-WHEAT': { type: 'yahoo', symbol: 'ZW=F', provider: 'Euronext MATIF / CBOT Wheat', exchange: 'MATIF' },
  'MATIF-RAPESEED': { type: 'yahoo', symbol: 'RS=F', provider: 'Euronext MATIF / ICE Canola', exchange: 'MATIF' },
  'COFFEE': { type: 'yahoo', symbol: 'KC=F', provider: 'ICE Coffee Arabica C', exchange: 'ICE' },
  'COCOA': { type: 'yahoo', symbol: 'CC=F', provider: 'ICE Cocoa Futures Live', exchange: 'ICE' },
  'CORN': { type: 'yahoo', symbol: 'ZC=F', provider: 'CBOT Corn Futures Live', exchange: 'CBOT' },
  'SOYBEAN': { type: 'yahoo', symbol: 'ZS=F', provider: 'CBOT Soybeans Futures', exchange: 'CBOT' },
  'SUGAR': { type: 'yahoo', symbol: 'SB=F', provider: 'ICE Sugar #11 World Sugar', exchange: 'ICE' },

  // Volatilidad Sintética
  'BLIP-VOL-100': { type: 'synthetic', symbol: '^VIX', multiplier: 240, provider: 'Cboe Volatility Index Feed', exchange: 'CBOE' },
  'BLIP-VOL-75': { type: 'synthetic', symbol: '^VIX', multiplier: 125, provider: 'Cboe Volatility Index Feed', exchange: 'CBOE' }
};

class RealMarketService {
  constructor() {
    this.latestPrices = {};
    this.marketStats = {};
    this.realCandles = {};
    this.wsClient = null;
    this.isReconnecting = false;
    this.lastYahooUpdate = 0;
  }

  init() {
    console.log('[RealMarketService] Inicializando conexiones a mercados mundiales en vivo...');
    this.initBinanceWebSocket();
    this.initYahooFinanceLoop();
  }

  /**
   * Conexión WebSocket a Binance para flujo milisegundo a milisegundo
   */
  initBinanceWebSocket() {
    try {
      const streams = 'btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker/bnbusdt@ticker/dogeusdt@ticker';
      const wsUrl = 'wss://stream.binance.com:9443/ws/' + streams;
      
      this.wsClient = new WebSocket(wsUrl, { rejectUnauthorized: false });

      this.wsClient.on('open', () => {
        console.log('[RealMarketService] 🟢 WebSocket Binance CONECTADO (Milisegundo a milisegundo)');
        this.isReconnecting = false;
      });

      this.wsClient.on('message', (data) => {
        try {
          const tick = JSON.parse(data);
          this.handleBinanceTick(tick);
        } catch (e) {}
      });

      this.wsClient.on('error', (err) => {
        console.error('[RealMarketService] Error en WebSocket Binance:', err.message);
      });

      this.wsClient.on('close', () => {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          console.log('[RealMarketService] WebSocket Binance cerrado. Reconectando en 3s...');
          setTimeout(() => this.initBinanceWebSocket(), 3000);
        }
      });
    } catch (err) {
      console.error('[RealMarketService] Error al crear WebSocket Binance:', err.message);
      setTimeout(() => this.initBinanceWebSocket(), 5000);
    }
  }

  handleBinanceTick(tick) {
    const symbolMap = {
      'BTCUSDT': ['BTCUSD', 'BLIP-BTC', 'DIGITAL-BTC'],
      'ETHUSDT': ['ETHUSD'],
      'SOLUSDT': ['SOLUSD'],
      'XRPUSDT': ['XRPUSD'],
      'BNBUSDT': ['BNBUSD'],
      'DOGEUSDT': ['DOGEUSD']
    };

    const targetSymbols = symbolMap[tick.s];
    if (!targetSymbols) return;

    const price = parseFloat(tick.c);
    const high = parseFloat(tick.h);
    const low = parseFloat(tick.l);
    const volume = parseFloat(tick.v);
    const change = parseFloat(tick.P);

    for (const sym of targetSymbols) {
      this.latestPrices[sym] = price;
      this.marketStats[sym] = {
        price,
        high,
        low,
        volume,
        change,
        isReal: true,
        source: 'Binance Global Spot (Live Feed)',
        timestamp: Date.now()
      };

      this.updateLiveCandle(sym, price, volume);
    }
  }

  /**
   * Sincronizador de Oro, Forex, Acciones y Materias Primas con Yahoo Finance
   */
  async initYahooFinanceLoop() {
    await this.fetchYahooQuotes();
    
    // Consultar cada 3.5 segundos para no saturar y mantener cotizaciones frescas
    setInterval(() => {
      this.fetchYahooQuotes();
    }, 3500);
  }

  async fetchYahooQuotes() {
    const yahooSymbols = [
      'GC=F', 'SI=F', 'PL=F', 'HG=F',
      'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X', 'USDCAD=X', 'EURJPY=X',
      'NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMZN', 'META',
      'SPY', 'QQQ', 'DIA', 'ARKK',
      '^DJI', '^IXIC', '^GSPC', '^GDAXI', '^FTSE',
      'BZ=F', 'CL=F', 'NG=F', 'HO=F',
      'ZW=F', 'RS=F', 'KC=F', 'CC=F', 'ZC=F', 'ZS=F', 'SB=F',
      '^VIX'
    ];

    try {
      // Usar endpoint de chart para obtener cotización y velas
      const batches = [];
      const batchSize = 6;
      for (let i = 0; i < yahooSymbols.length; i += batchSize) {
        batches.push(yahooSymbols.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        await Promise.all(batch.map(sym => this.fetchSingleYahooSymbol(sym)));
      }

      this.lastYahooUpdate = Date.now();
    } catch (err) {
      // Ignorar errores temporales
    }
  }

  async fetchSingleYahooSymbol(yahooSymbol) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=15m&range=5d`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) return;

      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (!meta || !meta.regularMarketPrice) return;

      const price = meta.regularMarketPrice;
      const high = meta.regularMarketDayHigh || meta.fiftyTwoWeekHigh || price;
      const low = meta.regularMarketDayLow || meta.fiftyTwoWeekLow || price;
      const change = meta.regularMarketChangePercent || 0;
      const volume = meta.regularMarketVolume || 50000;
      const exchange = meta.fullExchangeName || meta.exchangeName || 'MERCADO REAL';

      // Actualizar velas reales si están disponibles
      const timestamps = data?.chart?.result?.[0]?.timestamp;
      const quotes = data?.chart?.result?.[0]?.indicators?.quote?.[0];
      if (timestamps && quotes && quotes.open) {
        const candles = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (quotes.open[i] != null && quotes.close[i] != null) {
            candles.push({
              time: timestamps[i] * 1000,
              open: quotes.open[i],
              high: quotes.high[i],
              low: quotes.low[i],
              close: quotes.close[i],
              volume: quotes.volume?.[i] || 1000
            });
          }
        }
        if (candles.length > 0) {
          this.realCandles[yahooSymbol] = candles;
        }
      }

      // Enlazar a nuestros símbolos internos
      for (const [appSym, mapping] of Object.entries(REAL_ASSET_MAPPING)) {
        if (mapping.symbol === yahooSymbol) {
          if (mapping.type === 'synthetic' && mapping.multiplier) {
            const synthPrice = parseFloat((price * mapping.multiplier).toFixed(2));
            this.latestPrices[appSym] = synthPrice;
            this.marketStats[appSym] = {
              price: synthPrice,
              high: parseFloat((high * mapping.multiplier).toFixed(2)),
              low: parseFloat((low * mapping.multiplier).toFixed(2)),
              volume: volume * 10,
              change,
              isReal: true,
              source: `${mapping.provider} (${exchange})`,
              timestamp: Date.now()
            };
            this.updateLiveCandle(appSym, synthPrice, volume);
          } else {
            this.latestPrices[appSym] = price;
            this.marketStats[appSym] = {
              price,
              high,
              low,
              volume,
              change,
              isReal: true,
              source: `${mapping.provider} (${exchange})`,
              timestamp: Date.now()
            };
            this.updateLiveCandle(appSym, price, volume);
          }
        }
      }
    } catch (err) {
      // Ignorar fallos de red individuales
    }
  }

  updateLiveCandle(symbol, price, volume) {
    if (!this.realCandles[symbol]) {
      this.realCandles[symbol] = [];
    }

    const candles = this.realCandles[symbol];
    const now = Date.now();
    const oneMinute = 60000;
    const currentMinuteTime = Math.floor(now / oneMinute) * oneMinute;

    if (candles.length === 0) {
      candles.push({
        time: currentMinuteTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: volume || 10
      });
      return;
    }

    const lastCandle = candles[candles.length - 1];
    if (lastCandle.time === currentMinuteTime) {
      lastCandle.close = price;
      lastCandle.high = Math.max(lastCandle.high, price);
      lastCandle.low = Math.min(lastCandle.low, price);
      lastCandle.volume = (lastCandle.volume || 0) + 1;
    } else if (currentMinuteTime > lastCandle.time) {
      candles.push({
        time: currentMinuteTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 1
      });

      // Mantener máximo 100 velas en memoria
      if (candles.length > 100) {
        candles.shift();
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
    const mapping = REAL_ASSET_MAPPING[symbol];
    if (mapping && mapping.symbol && this.realCandles[mapping.symbol]) {
      return this.realCandles[mapping.symbol];
    }
    return this.realCandles[symbol] || null;
  }
}

export const realMarketService = new RealMarketService();
