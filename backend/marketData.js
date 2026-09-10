/**
 * Proveedor y Gestor de Datos para los 7 Mercados:
 * 1. Blitz (Opciones Turbo de Alta Velocidad)
 * 2. Digital (Opciones Digitales de Alta Rentabilidad)
 * 3. Forex CFD
 * 4. Acciones CFD
 * 5. ETF CFD
 * 6. Índices CFD
 * 7. Materias Primas CFD (MAT Prim)
 */

export const MARKETS_METADATA = {
  blips: {
    name: 'Blips / Opciones Rápidas',
    description: 'Operaciones ultrarrápidas de ticks, blips y volatilidad de 30s a 3 minutos.',
    icon: 'Zap',
    badge: 'Turbo Blips 95%',
    assets: [
      { symbol: 'BLIP-VOL-100', name: 'Índice Blip Volatilidad 100', basePrice: 4250.00, volatility: 0.0035, decimals: 2 },
      { symbol: 'BLIP-VOL-75', name: 'Índice Blip Volatilidad 75', basePrice: 2180.00, volatility: 0.0030, decimals: 2 },
      { symbol: 'BLIP-BTC', name: 'Bitcoin Blips Turbo 60s', basePrice: 89450.00, volatility: 0.0028, decimals: 2 },
      { symbol: 'BLIP-EURUSD', name: 'EUR/USD Blips 60s', basePrice: 1.0845, volatility: 0.0006, decimals: 5 },
      { symbol: 'BLIP-GOLD', name: 'Gold Blips 30s Turbo', basePrice: 2895.50, volatility: 0.0018, decimals: 2 }
    ]
  },
  digital: {
    name: 'Opciones Digitales',
    description: 'Opciones con strike dinámico, payout fijo de hasta el 94% y expiraciones de 1 a 15 minutos.',
    icon: 'Cpu',
    badge: 'Digital 94%',
    assets: [
      { symbol: 'DIGITAL-EURUSD', name: 'EUR/USD Digital (Strike Fijo)', basePrice: 1.0845, volatility: 0.0004, decimals: 5 },
      { symbol: 'DIGITAL-GBPUSD', name: 'GBP/USD Digital 5M', basePrice: 1.2980, volatility: 0.0005, decimals: 5 },
      { symbol: 'DIGITAL-USDJPY', name: 'USD/JPY Digital 1M', basePrice: 154.20, volatility: 0.0005, decimals: 3 },
      { symbol: 'DIGITAL-BTC', name: 'BTC/USD Digital Expiración 5M', basePrice: 89450.00, volatility: 0.0015, decimals: 2 }
    ]
  },
  forex: {
    name: 'Forex CFD con Margen',
    description: 'Mercado de divisas internacional con apalancamiento, spread reducido y margen.',
    icon: 'DollarSign',
    badge: 'Margin 1:100',
    assets: [
      { symbol: 'EURUSD', name: 'Euro / Dólar Estadounidense', basePrice: 1.0845, volatility: 0.0003, decimals: 5 },
      { symbol: 'GBPUSD', name: 'Libra Esterlina / Dólar USD', basePrice: 1.2980, volatility: 0.0004, decimals: 5 },
      { symbol: 'USDJPY', name: 'Dólar USD / Yen Japonés', basePrice: 154.20, volatility: 0.0004, decimals: 3 },
      { symbol: 'AUDUSD', name: 'Dólar Australiano / USD', basePrice: 0.6550, volatility: 0.0004, decimals: 5 },
      { symbol: 'USDCAD', name: 'Dólar USD / Dólar Canadiense', basePrice: 1.3910, volatility: 0.0003, decimals: 5 },
      { symbol: 'EURJPY', name: 'Euro / Yen Japonés', basePrice: 167.25, volatility: 0.0004, decimals: 3 }
    ]
  },
  acciones: {
    name: 'Acciones CFD',
    description: 'CFDs sobre las principales acciones de Wall Street con apalancamiento.',
    icon: 'TrendingUp',
    badge: 'Wall St. Equities',
    assets: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 138.50, volatility: 0.0018, decimals: 2 },
      { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 228.30, volatility: 0.0009, decimals: 2 },
      { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 265.40, volatility: 0.0025, decimals: 2 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 422.10, volatility: 0.0008, decimals: 2 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 186.20, volatility: 0.0012, decimals: 2 },
      { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 585.60, volatility: 0.0015, decimals: 2 }
    ]
  },
  etf: {
    name: 'ETF CFD',
    description: 'Fondos cotizados en bolsa que rastrean canastas diversificadas y sectores.',
    icon: 'Layers',
    badge: 'Index Tracker',
    assets: [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', basePrice: 574.80, volatility: 0.0006, decimals: 2 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust (Tech 100)', basePrice: 489.20, volatility: 0.0009, decimals: 2 },
      { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average', basePrice: 422.50, volatility: 0.0005, decimals: 2 },
      { symbol: 'ARKK', name: 'ARK Innovation ETF', basePrice: 48.90, volatility: 0.0022, decimals: 2 }
    ]
  },
  indices: {
    name: 'Índices CFD',
    description: 'Contratos por diferencia de los índices bursátiles más importantes del mundo.',
    icon: 'BarChart2',
    badge: 'Global Indices',
    assets: [
      { symbol: 'US30', name: 'Dow Jones 30 CFD', basePrice: 42450.00, volatility: 0.0006, decimals: 1 },
      { symbol: 'NAS100', name: 'Nasdaq 100 CFD Tech', basePrice: 20420.00, volatility: 0.0009, decimals: 1 },
      { symbol: 'SPX500', name: 'S&P 500 CFD', basePrice: 5760.00, volatility: 0.0007, decimals: 1 },
      { symbol: 'GER40', name: 'Alemania 40 (DAX CFD)', basePrice: 19480.00, volatility: 0.0008, decimals: 1 },
      { symbol: 'UK100', name: 'Reino Unido 100 (FTSE CFD)', basePrice: 8250.00, volatility: 0.0006, decimals: 1 }
    ]
  },
  matif_prime: {
    name: 'MATIF Prime CFD',
    description: 'Materias primas agrícolas de referencia europea (MATIF Euronext) y Commodities Prime Spot.',
    icon: 'Flame',
    badge: 'MATIF & Commodities',
    assets: [
      { symbol: 'MATIF-WHEAT', name: 'Trigo Euronext MATIF (Milling Wheat)', basePrice: 218.50, volatility: 0.0012, decimals: 2 },
      { symbol: 'MATIF-RAPESEED', name: 'Colza Euronext MATIF (Rapeseed)', basePrice: 468.25, volatility: 0.0014, decimals: 2 },
      { symbol: 'XAUUSD', name: 'Oro Spot Prime CFD (Gold / USD)', basePrice: 2895.50, volatility: 0.0008, decimals: 2 },
      { symbol: 'WTI', name: 'Petróleo Crudo WTI Prime CFD', basePrice: 71.40, volatility: 0.0015, decimals: 2 },
      { symbol: 'XAGUSD', name: 'Plata Spot Prime CFD (Silver / USD)', basePrice: 34.20, volatility: 0.0016, decimals: 3 },
      { symbol: 'NATGAS', name: 'Gas Natural Prime CFD', basePrice: 2.850, volatility: 0.0022, decimals: 3 }
    ]
  },
  crypto: {
    name: 'Criptomonedas 24/7',
    description: 'Mercado de activos digitales de alta volatilidad disponible las 24 horas del día.',
    icon: 'Bitcoin',
    badge: 'Crypto 24/7',
    assets: [
      { symbol: 'BTCUSD', name: 'Bitcoin / USD (24/7)', basePrice: 89450.00, volatility: 0.0022, decimals: 2 },
      { symbol: 'ETHUSD', name: 'Ethereum / USD', basePrice: 3420.00, volatility: 0.0028, decimals: 2 },
      { symbol: 'SOLUSD', name: 'Solana / USD', basePrice: 198.50, volatility: 0.0035, decimals: 2 },
      { symbol: 'XRPUSD', name: 'Ripple XRP / USD', basePrice: 1.4850, volatility: 0.0040, decimals: 4 },
      { symbol: 'BNBUSD', name: 'Binance Coin / USD', basePrice: 655.00, volatility: 0.0025, decimals: 2 },
      { symbol: 'DOGEUSD', name: 'Dogecoin / USD', basePrice: 0.2650, volatility: 0.0045, decimals: 4 }
    ]
  },
  energias: {
    name: 'Energías CFD',
    description: 'Recursos energéticos con alta correlación geopolítica y macroeconómica.',
    icon: 'Flame',
    badge: 'Energy Spot',
    assets: [
      { symbol: 'BRENT', name: 'Petróleo Crudo Brent CFD', basePrice: 75.80, volatility: 0.0014, decimals: 2 },
      { symbol: 'WTI-CRUDE', name: 'Petróleo WTI Light Sweet', basePrice: 71.40, volatility: 0.0015, decimals: 2 },
      { symbol: 'NATGAS-US', name: 'Gas Natural Henry Hub', basePrice: 2.850, volatility: 0.0025, decimals: 3 },
      { symbol: 'HEATOIL', name: 'Gasóleo Calefacción CFD', basePrice: 2.420, volatility: 0.0018, decimals: 4 }
    ]
  },
  metales: {
    name: 'Metales Preciosos Spot',
    description: 'Metales nobles y refugios seguros con alta liquidez y demanda industrial.',
    icon: 'Shield',
    badge: 'Precious Metals',
    assets: [
      { symbol: 'XAU-GOLD', name: 'Oro Físico Spot (XAU/USD)', basePrice: 2895.50, volatility: 0.0008, decimals: 2 },
      { symbol: 'XAG-SILVER', name: 'Plata Fina Spot (XAG/USD)', basePrice: 34.20, volatility: 0.0016, decimals: 3 },
      { symbol: 'XPT-PLAT', name: 'Platino Spot (XPT/USD)', basePrice: 985.00, volatility: 0.0015, decimals: 2 },
      { symbol: 'COPPER', name: 'Cobre Grado A CFD', basePrice: 4.450, volatility: 0.0014, decimals: 3 }
    ]
  },
  agricolas: {
    name: 'Materias Primas Agrícolas',
    description: 'Commodities blandos y granos globales cotizados en CBOT e ICE.',
    icon: 'Wheat',
    badge: 'CBOT & Softs',
    assets: [
      { symbol: 'COFFEE', name: 'Café Arábica C CFD', basePrice: 245.50, volatility: 0.0018, decimals: 2 },
      { symbol: 'COCOA', name: 'Cacao Reino Unido / NY', basePrice: 7850.00, volatility: 0.0024, decimals: 1 },
      { symbol: 'CORN', name: 'Maíz CBOT (Corn Futures)', basePrice: 428.00, volatility: 0.0012, decimals: 2 },
      { symbol: 'SOYBEAN', name: 'Soja CBOT (Soybeans)', basePrice: 1025.00, volatility: 0.0013, decimals: 2 },
      { symbol: 'SUGAR', name: 'Azúcar N° 11 Mundial', basePrice: 22.40, volatility: 0.0016, decimals: 2 }
    ]
  },
  bonos: {
    name: 'Bonos Soberanos',
    description: 'Renta fija y deuda soberana de las economías más sólidas del mundo.',
    icon: 'Landmark',
    badge: 'Sovereign Debt',
    assets: [
      { symbol: 'US10Y', name: 'Bono Tesoro USA 10 Años', basePrice: 112.45, volatility: 0.0004, decimals: 2 },
      { symbol: 'BUND', name: 'Euro-Bund Alemán 10Y', basePrice: 133.20, volatility: 0.0004, decimals: 2 },
      { symbol: 'GILT', name: 'Bono Reino Unido 10Y (Gilt)', basePrice: 98.60, volatility: 0.0005, decimals: 2 }
    ]
  }
};

import { realMarketService, REAL_ASSET_MAPPING } from './realMarketService.js';

class MarketDataManager {
  constructor() {
    this.candlesStore = new Map(); // key: symbol
    this.currentPrices = new Map();
    this.initHistoricalData();
    realMarketService.init();
    this.startLiveTickSimulation();
  }

  initHistoricalData() {
    // Inicializa serie de velas para cada activo
    for (const [marketKey, market] of Object.entries(MARKETS_METADATA)) {
      for (const asset of market.assets) {
        let price = asset.basePrice;
        const candles = [];
        const now = Date.now();
        const candleInterval = 60 * 1000; // 1 minuto por vela

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
    // Micro-ticks de alta frecuencia anclados al precio real de Wall Street y Binance
    setInterval(() => {
      for (const [marketKey, market] of Object.entries(MARKETS_METADATA)) {
        for (const asset of market.assets) {
          const realPrice = realMarketService.getRealPrice(asset.symbol);
          const base = realPrice || this.currentPrices.get(asset.symbol) || asset.basePrice;
          
          // Micro-fluctuación sub-segundo para mantener el gráfico dinámico
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
    }, 450);
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
          feedSource: mapping?.provider || 'Wall Street / Binance Live Feed'
        };
      }
    }
    return null;
  }
}

export const marketData = new MarketDataManager();
export { realMarketService, REAL_ASSET_MAPPING };
