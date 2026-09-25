import { realMarketService, REAL_ASSET_MAPPING } from './realMarketService.js';

/**
 * CATÁLOGO EXCLUSIVO DE LOS 7 MERCADOS OFICIALES DE LA APP IQ OPTION:
 * 1. ⚡ Blitz (Opciones Blitz Turbo 5s - 60s)
 * 2. 💎 Digital (Opciones Digitales 1m - 15m)
 * 3. 💱 Forex (Forex CFD con Margen x50 - x1000)
 * 4. 📈 Acciones (Stocks CFD de Wall Street x20)
 * 5. 📊 ETFs (ETF CFD Fondos Indexados x20)
 * 6. 🏛️ Índices (Índices Bursátiles Globales x50 - x150)
 * 7. 🛢️ Materias Primas (Commodities Spot x20 - x100)
 */

export const MARKETS_METADATA = {
  blitz: {
    name: 'Blitz IQ Option',
    shortName: 'Blitz',
    description: 'Opciones ultrarrápidas exclusivas de IQ Option (5s a 60s) con los mayores payouts de la app (hasta 95%).',
    icon: 'Zap',
    badge: 'Turbo 95% Payout',
    iqType: 'blitz',
    assets: [
      { symbol: 'EURUSD-BLITZ', name: 'EUR/USD (Blitz IQ Option)', basePrice: 1.0845, volatility: 0.0006, decimals: 5, payout: 95, expRange: '5s - 60s', isOTC: false },
      { symbol: 'GBPUSD-BLITZ', name: 'GBP/USD (Blitz IQ Option)', basePrice: 1.2980, volatility: 0.0006, decimals: 5, payout: 92, expRange: '5s - 60s', isOTC: false },
      { symbol: 'USDJPY-BLITZ', name: 'USD/JPY (Blitz IQ Option)', basePrice: 154.20, volatility: 0.0005, decimals: 3, payout: 90, expRange: '5s - 60s', isOTC: false },
      { symbol: 'AUDCAD-BLITZ', name: 'AUD/CAD (Blitz IQ Option)', basePrice: 0.9025, volatility: 0.0006, decimals: 5, payout: 91, expRange: '5s - 60s', isOTC: false },
      { symbol: 'BTCUSD-BLITZ', name: 'Bitcoin (Blitz IQ Option)', basePrice: 89450.00, volatility: 0.0028, decimals: 2, payout: 94, expRange: '10s - 60s', isOTC: false },
      { symbol: 'GOLD-BLITZ', name: 'Gold / Oro (Blitz IQ Option)', basePrice: 2895.50, volatility: 0.0018, decimals: 2, payout: 93, expRange: '5s - 60s', isOTC: false },
      { symbol: 'EURUSD-OTC-BLITZ', name: 'EUR/USD (OTC) Blitz 24/7', basePrice: 1.0842, volatility: 0.0007, decimals: 5, payout: 95, expRange: '5s - 60s', isOTC: true },
      { symbol: 'GBPUSD-OTC-BLITZ', name: 'GBP/USD (OTC) Blitz 24/7', basePrice: 1.2975, volatility: 0.0007, decimals: 5, payout: 93, expRange: '5s - 60s', isOTC: true }
    ]
  },
  digital: {
    name: 'Digitales IQ Option',
    shortName: 'Digital',
    description: 'Opciones digitales de IQ Option con expiraciones de 1m, 5m y 15m y strikes dinámicos.',
    icon: 'Cpu',
    badge: 'Digital 94% Payout',
    iqType: 'digital',
    assets: [
      { symbol: 'DIGITAL-EURUSD', name: 'EUR/USD Digital IQ Option', basePrice: 1.0845, volatility: 0.0004, decimals: 5, payout: 94, expRange: '1m, 5m, 15m', isOTC: false },
      { symbol: 'DIGITAL-GBPUSD', name: 'GBP/USD Digital IQ Option', basePrice: 1.2980, volatility: 0.0005, decimals: 5, payout: 92, expRange: '1m, 5m, 15m', isOTC: false },
      { symbol: 'DIGITAL-USDJPY', name: 'USD/JPY Digital IQ Option', basePrice: 154.20, volatility: 0.0005, decimals: 3, payout: 91, expRange: '1m, 5m, 15m', isOTC: false },
      { symbol: 'DIGITAL-EURJPY', name: 'EUR/JPY Digital IQ Option', basePrice: 167.25, volatility: 0.0004, decimals: 3, payout: 90, expRange: '1m, 5m, 15m', isOTC: false },
      { symbol: 'DIGITAL-AUDUSD', name: 'AUD/USD Digital IQ Option', basePrice: 0.6550, volatility: 0.0004, decimals: 5, payout: 92, expRange: '1m, 5m, 15m', isOTC: false },
      { symbol: 'DIGITAL-GBPJPY', name: 'GBP/JPY Digital IQ Option', basePrice: 199.80, volatility: 0.0005, decimals: 3, payout: 89, expRange: '1m, 5m, 15m', isOTC: false },
      { symbol: 'DIGITAL-EURUSD-OTC', name: 'EUR/USD (OTC) Digital 24/7', basePrice: 1.0842, volatility: 0.0005, decimals: 5, payout: 95, expRange: '1m, 5m, 15m', isOTC: true },
      { symbol: 'DIGITAL-GBPUSD-OTC', name: 'GBP/USD (OTC) Digital 24/7', basePrice: 1.2975, volatility: 0.0005, decimals: 5, payout: 93, expRange: '1m, 5m, 15m', isOTC: true }
    ]
  },
  forex: {
    name: 'Forex CFD IQ Option',
    shortName: 'Forex',
    description: 'Pares de divisas oficiales de IQ Option con multiplicadores de apalancamiento x50 hasta x1000.',
    icon: 'DollarSign',
    badge: 'Multiplicador x1000',
    iqType: 'forex',
    assets: [
      { symbol: 'EURUSD', name: 'EUR/USD (Forex IQ Option)', basePrice: 1.0845, volatility: 0.0003, decimals: 5, multiplier: 'x1000', maxLeverage: 1000, isOTC: false },
      { symbol: 'GBPUSD', name: 'GBP/USD (Forex IQ Option)', basePrice: 1.2980, volatility: 0.0004, decimals: 5, multiplier: 'x1000', maxLeverage: 1000, isOTC: false },
      { symbol: 'USDJPY', name: 'USD/JPY (Forex IQ Option)', basePrice: 154.20, volatility: 0.0004, decimals: 3, multiplier: 'x1000', maxLeverage: 1000, isOTC: false },
      { symbol: 'AUDUSD', name: 'AUD/USD (Forex IQ Option)', basePrice: 0.6550, volatility: 0.0004, decimals: 5, multiplier: 'x500', maxLeverage: 500, isOTC: false },
      { symbol: 'USDCAD', name: 'USD/CAD (Forex IQ Option)', basePrice: 1.3910, volatility: 0.0003, decimals: 5, multiplier: 'x500', maxLeverage: 500, isOTC: false },
      { symbol: 'EURGBP', name: 'EUR/GBP (Forex IQ Option)', basePrice: 0.8355, volatility: 0.0003, decimals: 5, multiplier: 'x500', maxLeverage: 500, isOTC: false },
      { symbol: 'NZDUSD', name: 'NZD/USD (Forex IQ Option)', basePrice: 0.5920, volatility: 0.0004, decimals: 5, multiplier: 'x500', maxLeverage: 500, isOTC: false },
      { symbol: 'EURUSD-OTC', name: 'EUR/USD (OTC Forex IQ Option)', basePrice: 1.0842, volatility: 0.0004, decimals: 5, multiplier: 'x500', maxLeverage: 500, isOTC: true }
    ]
  },
  acciones: {
    name: 'Acciones CFD IQ Option',
    shortName: 'Acciones',
    description: 'CFDs sobre las principales acciones de Wall Street negociadas en IQ Option con multiplicador x20.',
    icon: 'TrendingUp',
    badge: 'Multiplicador x20',
    iqType: 'acciones',
    assets: [
      { symbol: 'TSLA', name: 'Tesla Inc. CFD IQ Option', basePrice: 265.40, volatility: 0.0025, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'AAPL', name: 'Apple Inc. CFD IQ Option', basePrice: 228.30, volatility: 0.0009, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'NVDA', name: 'NVIDIA Corp. CFD IQ Option', basePrice: 138.50, volatility: 0.0018, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'AMZN', name: 'Amazon.com Inc. CFD IQ Option', basePrice: 186.20, volatility: 0.0012, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'MSFT', name: 'Microsoft Corp. CFD IQ Option', basePrice: 422.10, volatility: 0.0008, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'META', name: 'Meta Platforms Inc. CFD IQ Option', basePrice: 585.60, volatility: 0.0015, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'NFLX', name: 'Netflix Inc. CFD IQ Option', basePrice: 695.20, volatility: 0.0016, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'GOOGL', name: 'Alphabet (Google) CFD IQ Option', basePrice: 178.40, volatility: 0.0011, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'AMD', name: 'Advanced Micro Devices CFD IQ Option', basePrice: 156.80, volatility: 0.0022, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false }
    ]
  },
  etf: {
    name: 'ETF CFD IQ Option',
    shortName: 'ETFs',
    description: 'Fondos cotizados en bolsa oficiales disponibles en IQ Option que rastrean los principales índices.',
    icon: 'Layers',
    badge: 'Multiplicador x20',
    iqType: 'etf',
    assets: [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF IQ Option', basePrice: 574.80, volatility: 0.0006, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'QQQ', name: 'Invesco QQQ (Nasdaq 100) IQ Option', basePrice: 489.20, volatility: 0.0009, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'DIA', name: 'SPDR Dow Jones Industrial IQ Option', basePrice: 422.50, volatility: 0.0005, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'XLF', name: 'Financial Select Sector SPDR IQ Option', basePrice: 47.60, volatility: 0.0008, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'EEM', name: 'iShares MSCI Emerging Markets IQ Option', basePrice: 44.80, volatility: 0.0012, decimals: 2, multiplier: 'x20', maxLeverage: 20, isOTC: false }
    ]
  },
  indices: {
    name: 'Índices CFD IQ Option',
    shortName: 'Índices',
    description: 'Contratos por diferencia de los índices bursátiles más importantes del mundo en IQ Option.',
    icon: 'BarChart2',
    badge: 'Multiplicador x150',
    iqType: 'indices',
    assets: [
      { symbol: 'US30', name: 'Dow Jones 30 (US 30 CFD IQ Option)', basePrice: 42450.00, volatility: 0.0006, decimals: 1, multiplier: 'x150', maxLeverage: 150, isOTC: false },
      { symbol: 'NAS100', name: 'Nasdaq 100 (Tech 100 CFD IQ Option)', basePrice: 20420.00, volatility: 0.0009, decimals: 1, multiplier: 'x150', maxLeverage: 150, isOTC: false },
      { symbol: 'SPX500', name: 'S&P 500 CFD IQ Option', basePrice: 5760.00, volatility: 0.0007, decimals: 1, multiplier: 'x150', maxLeverage: 150, isOTC: false },
      { symbol: 'GER40', name: 'Alemania 40 (DAX CFD IQ Option)', basePrice: 19480.00, volatility: 0.0008, decimals: 1, multiplier: 'x100', maxLeverage: 100, isOTC: false },
      { symbol: 'UK100', name: 'Reino Unido 100 (FTSE CFD IQ Option)', basePrice: 8250.00, volatility: 0.0006, decimals: 1, multiplier: 'x100', maxLeverage: 100, isOTC: false },
      { symbol: 'NIKKEI225', name: 'Japón 225 (Nikkei CFD IQ Option)', basePrice: 38850.00, volatility: 0.0008, decimals: 1, multiplier: 'x100', maxLeverage: 100, isOTC: false }
    ]
  },
  materias_primas: {
    name: 'Materias Primas IQ Option',
    shortName: 'Materias Primas',
    description: 'Commodities oficiales de la app IQ Option (Metales y Energías) con multiplicador hasta x100.',
    icon: 'Flame',
    badge: 'Multiplicador x100',
    iqType: 'commodities',
    assets: [
      { symbol: 'XAUUSD', name: 'Oro Spot (Gold / USD CFD IQ Option)', basePrice: 2895.50, volatility: 0.0008, decimals: 2, multiplier: 'x100', maxLeverage: 100, isOTC: false },
      { symbol: 'WTI', name: 'Petróleo Crudo WTI CFD IQ Option', basePrice: 71.40, volatility: 0.0015, decimals: 2, multiplier: 'x50', maxLeverage: 50, isOTC: false },
      { symbol: 'BRENT', name: 'Petróleo Crudo Brent CFD IQ Option', basePrice: 75.80, volatility: 0.0014, decimals: 2, multiplier: 'x50', maxLeverage: 50, isOTC: false },
      { symbol: 'XAGUSD', name: 'Plata Spot (Silver / USD CFD IQ Option)', basePrice: 34.20, volatility: 0.0016, decimals: 3, multiplier: 'x50', maxLeverage: 50, isOTC: false },
      { symbol: 'NATGAS', name: 'Gas Natural CFD IQ Option', basePrice: 2.850, volatility: 0.0022, decimals: 3, multiplier: 'x20', maxLeverage: 20, isOTC: false },
      { symbol: 'PLATINUM', name: 'Platino Spot (Platinum CFD IQ Option)', basePrice: 985.00, volatility: 0.0012, decimals: 2, multiplier: 'x50', maxLeverage: 50, isOTC: false },
      { symbol: 'GOLD-OTC', name: 'Oro (OTC Gold CFD IQ Option)', basePrice: 2895.10, volatility: 0.0009, decimals: 2, multiplier: 'x100', maxLeverage: 100, isOTC: true }
    ]
  }
};

class MarketDataManager {
  constructor() {
    this.candlesStore = new Map(); // key: symbol
    this.currentPrices = new Map();
    this.initHistoricalData();
    realMarketService.init();
    this.startLiveTickSimulation();
  }

  initHistoricalData() {
    // Genera 60 velas históricas para cada activo oficial de IQ Option
    for (const [marketKey, market] of Object.entries(MARKETS_METADATA)) {
      for (const asset of market.assets) {
        let price = asset.basePrice;
        const candles = [];
        const now = Date.now();
        const candleInterval = 60 * 1000;

        for (let i = 59; i >= 0; i--) {
          const timestamp = now - (i * candleInterval);
          const changePercent = (Math.random() - 0.495) * asset.volatility * 2.5;
          const open = price;
          const close = Number((open * (1 + changePercent)).toFixed(asset.decimals));
          const high = Number((Math.max(open, close) * (1 + Math.random() * asset.volatility * 0.8)).toFixed(asset.decimals));
          const low = Number((Math.min(open, close) * (1 - Math.random() * asset.volatility * 0.8)).toFixed(asset.decimals));
          const volume = Math.floor(1000 + Math.random() * 8000);

          candles.push({ timestamp, open, high, low, close, volume });
          price = close;
        }

        this.candlesStore.set(asset.symbol, candles);
        this.currentPrices.set(asset.symbol, price);
      }
    }
  }

  startLiveTickSimulation() {
    // Micro-ticks de alta frecuencia anclados al precio en tiempo real
    setInterval(() => {
      for (const [marketKey, market] of Object.entries(MARKETS_METADATA)) {
        for (const asset of market.assets) {
          const realPrice = realMarketService.getRealPrice(asset.symbol);
          const base = realPrice || this.currentPrices.get(asset.symbol) || asset.basePrice;
          
          // Micro-fluctuación sub-segundo característica del gráfico de IQ Option
          const microDelta = (Math.random() - 0.495) * asset.volatility * base * 0.12;
          const newPrice = Number((base + microDelta).toFixed(asset.decimals));
          this.currentPrices.set(asset.symbol, newPrice);

          // Actualizar la última vela activa en la tienda
          const candles = this.candlesStore.get(asset.symbol);
          if (candles && candles.length > 0) {
            const lastCandle = candles[candles.length - 1];
            lastCandle.close = newPrice;
            if (newPrice > lastCandle.high) lastCandle.high = newPrice;
            if (newPrice < lastCandle.low) lastCandle.low = newPrice;
            lastCandle.volume += Math.floor(Math.random() * 20);

            // Si ha pasado más de 1 minuto, cerrar vela y crear una nueva
            if (Date.now() - lastCandle.timestamp > 60 * 1000) {
              candles.push({
                timestamp: Date.now(),
                open: newPrice,
                high: newPrice,
                low: newPrice,
                close: newPrice,
                volume: Math.floor(100 + Math.random() * 500)
              });
              if (candles.length > 80) candles.shift();
            }
          }
        }
      }
    }, 180);
  }

  getCandles(symbol) {
    const realCandles = realMarketService.getRealCandles(symbol);
    if (realCandles && realCandles.length >= 10) {
      return realCandles;
    }
    return this.candlesStore.get(symbol) || [];
  }

  getCurrentPrice(symbol) {
    const realPrice = realMarketService.getRealPrice(symbol);
    if (realPrice) return realPrice;
    return this.currentPrices.get(symbol) || 0;
  }

  getAssetMetadata(symbol) {
    for (const [marketKey, market] of Object.entries(MARKETS_METADATA)) {
      const asset = market.assets.find(a => a.symbol === symbol);
      if (asset) {
        const realStats = realMarketService.getRealStats(symbol);
        const mapping = REAL_ASSET_MAPPING[symbol];
        return {
          ...asset,
          marketKey,
          marketName: market.name,
          currentPrice: realStats?.price || this.getCurrentPrice(symbol),
          realStats: realStats || null,
          mapping: mapping || null,
          isRealFeed: true,
          feedSource: mapping?.provider || 'IQ Option Live Real-Time Feed'
        };
      }
    }
    return null;
  }
}

export const marketData = new MarketDataManager();
export { realMarketService, REAL_ASSET_MAPPING };
