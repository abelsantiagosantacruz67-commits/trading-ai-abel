import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import MarketSelector from './components/MarketSelector';
import ChartView from './components/ChartView';
import AIPredictionCard from './components/AIPredictionCard';
import SignalHistory from './components/SignalHistory';
import PaywallModal from './components/PaywallModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import { 
  Sparkles, RefreshCw, Zap, TrendingUp, TrendingDown, 
  ShieldCheck, AlertCircle, Check, X, User, LogIn, UserPlus 
} from 'lucide-react';

const DEFAULT_MARKETS = {
  blips: {
    name: 'Blips / Opciones Rápidas',
    description: 'Operaciones ultrarrápidas de ticks, blips y volatilidad de 30s a 3 minutos.',
    badge: 'Turbo Blips 95%',
    assets: [
      { symbol: 'BLIP-VOL-100', name: 'Índice Blip Volatilidad 100', basePrice: 4250.00 },
      { symbol: 'BLIP-VOL-75', name: 'Índice Blip Volatilidad 75', basePrice: 2180.00 },
      { symbol: 'BLIP-BTC', name: 'Bitcoin Blips Turbo 60s', basePrice: 89450.00 },
      { symbol: 'BLIP-EURUSD', name: 'EUR/USD Blips 60s', basePrice: 1.0845 },
      { symbol: 'BLIP-GOLD', name: 'Gold Blips 30s Turbo', basePrice: 2895.50 }
    ]
  },
  digital: {
    name: 'Opciones Digitales',
    description: 'Opciones con strike dinámico, payout fijo de hasta el 94% y expiraciones de 1 a 15 minutos.',
    badge: 'Digital 94%',
    assets: [
      { symbol: 'DIGITAL-EURUSD', name: 'EUR/USD Digital (Strike Fijo)', basePrice: 1.0845 },
      { symbol: 'DIGITAL-GBPUSD', name: 'GBP/USD Digital 5M', basePrice: 1.2980 },
      { symbol: 'DIGITAL-USDJPY', name: 'USD/JPY Digital 1M', basePrice: 154.20 },
      { symbol: 'DIGITAL-BTC', name: 'BTC/USD Digital Expiración 5M', basePrice: 89450.00 }
    ]
  },
  forex: {
    name: 'Forex CFD con Margen',
    description: 'Mercado de divisas internacional con apalancamiento, spread reducido y margen.',
    badge: 'Margin 1:100',
    assets: [
      { symbol: 'EURUSD', name: 'Euro / Dólar Estadounidense', basePrice: 1.0845 },
      { symbol: 'GBPUSD', name: 'Libra Esterlina / Dólar USD', basePrice: 1.2980 },
      { symbol: 'USDJPY', name: 'Dólar USD / Yen Japonés', basePrice: 154.20 },
      { symbol: 'AUDUSD', name: 'Dólar Australiano / USD', basePrice: 0.6550 },
      { symbol: 'USDCAD', name: 'Dólar USD / Dólar Canadiense', basePrice: 1.3910 },
      { symbol: 'EURJPY', name: 'Euro / Yen Japonés', basePrice: 167.25 }
    ]
  },
  acciones: {
    name: 'Acciones CFD',
    description: 'CFDs sobre las principales acciones de Wall Street con apalancamiento.',
    badge: 'Wall St. Equities',
    assets: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 138.50 },
      { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 228.30 },
      { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 265.40 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 422.10 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 186.20 },
      { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 585.60 }
    ]
  },
  etf: {
    name: 'ETF CFD',
    description: 'Fondos cotizados en bolsa que rastrean canastas diversificadas y sectores.',
    badge: 'Index Tracker',
    assets: [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', basePrice: 574.80 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust (Tech 100)', basePrice: 489.20 },
      { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average', basePrice: 422.50 },
      { symbol: 'ARKK', name: 'ARK Innovation ETF', basePrice: 48.90 }
    ]
  },
  indices: {
    name: 'Índices CFD',
    description: 'Contratos por diferencia de los índices bursátiles más importantes del mundo.',
    badge: 'Global Indices',
    assets: [
      { symbol: 'US30', name: 'Dow Jones 30 CFD', basePrice: 42450.00 },
      { symbol: 'NAS100', name: 'Nasdaq 100 CFD Tech', basePrice: 20420.00 },
      { symbol: 'SPX500', name: 'S&P 500 CFD', basePrice: 5760.00 },
      { symbol: 'GER40', name: 'Alemania 40 (DAX CFD)', basePrice: 19480.00 },
      { symbol: 'UK100', name: 'Reino Unido 100 (FTSE CFD)', basePrice: 8250.00 }
    ]
  },
  matif_prime: {
    name: 'MATIF Prime CFD',
    description: 'Materias primas agrícolas de referencia europea (MATIF Euronext) y Commodities Prime Spot.',
    badge: 'MATIF & Commodities',
    assets: [
      { symbol: 'MATIF-WHEAT', name: 'Trigo Euronext MATIF (Milling Wheat)', basePrice: 218.50 },
      { symbol: 'MATIF-RAPESEED', name: 'Colza Euronext MATIF (Rapeseed)', basePrice: 468.25 },
      { symbol: 'XAUUSD', name: 'Oro Spot Prime CFD (Gold / USD)', basePrice: 2895.50 },
      { symbol: 'WTI', name: 'Petróleo Crudo WTI Prime CFD', basePrice: 71.40 },
      { symbol: 'XAGUSD', name: 'Plata Spot Prime CFD (Silver / USD)', basePrice: 34.20 },
      { symbol: 'NATGAS', name: 'Gas Natural Prime CFD', basePrice: 2.850 }
    ]
  },
  crypto: {
    name: 'Criptomonedas 24/7',
    description: 'Mercado de activos digitales de alta volatilidad disponible las 24 horas del día.',
    badge: 'Crypto 24/7',
    assets: [
      { symbol: 'BTCUSD', name: 'Bitcoin / USD (24/7)', basePrice: 89450.00 },
      { symbol: 'ETHUSD', name: 'Ethereum / USD', basePrice: 3420.00 },
      { symbol: 'SOLUSD', name: 'Solana / USD', basePrice: 198.50 },
      { symbol: 'XRPUSD', name: 'Ripple XRP / USD', basePrice: 1.4850 },
      { symbol: 'BNBUSD', name: 'Binance Coin / USD', basePrice: 655.00 },
      { symbol: 'DOGEUSD', name: 'Dogecoin / USD', basePrice: 0.2650 }
    ]
  },
  energias: {
    name: 'Energías CFD',
    description: 'Recursos energéticos con alta correlación geopolítica y macroeconómica.',
    badge: 'Energy Spot',
    assets: [
      { symbol: 'BRENT', name: 'Petróleo Crudo Brent CFD', basePrice: 75.80 },
      { symbol: 'WTI-CRUDE', name: 'Petróleo WTI Light Sweet', basePrice: 71.40 },
      { symbol: 'NATGAS-US', name: 'Gas Natural Henry Hub', basePrice: 2.850 },
      { symbol: 'HEATOIL', name: 'Gasóleo Calefacción CFD', basePrice: 2.420 }
    ]
  },
  metales: {
    name: 'Metales Preciosos Spot',
    description: 'Metales nobles y refugios seguros con alta liquidez y demanda industrial.',
    badge: 'Precious Metals',
    assets: [
      { symbol: 'XAU-GOLD', name: 'Oro Físico Spot (XAU/USD)', basePrice: 2895.50 },
      { symbol: 'XAG-SILVER', name: 'Plata Fina Spot (XAG/USD)', basePrice: 34.20 },
      { symbol: 'XPT-PLAT', name: 'Platino Spot (XPT/USD)', basePrice: 985.00 },
      { symbol: 'COPPER', name: 'Cobre Grado A CFD', basePrice: 4.450 }
    ]
  },
  agricolas: {
    name: 'Materias Primas Agrícolas',
    description: 'Commodities blandos y granos globales cotizados en CBOT e ICE.',
    badge: 'CBOT & Softs',
    assets: [
      { symbol: 'COFFEE', name: 'Café Arábica C CFD', basePrice: 245.50 },
      { symbol: 'COCOA', name: 'Cacao Reino Unido / NY', basePrice: 7850.00 },
      { symbol: 'CORN', name: 'Maíz CBOT (Corn Futures)', basePrice: 428.00 },
      { symbol: 'SOYBEAN', name: 'Soja CBOT (Soybeans)', basePrice: 1025.00 },
      { symbol: 'SUGAR', name: 'Azúcar N° 11 Mundial', basePrice: 22.40 }
    ]
  },
  bonos: {
    name: 'Bonos Soberanos',
    description: 'Renta fija y deuda soberana de las economías más sólidas del mundo.',
    badge: 'Sovereign Debt',
    assets: [
      { symbol: 'US10Y', name: 'Bono Tesoro USA 10 Años', basePrice: 112.45 },
      { symbol: 'BUND', name: 'Euro-Bund Alemán 10Y', basePrice: 133.20 },
      { symbol: 'GILT', name: 'Bono Reino Unido 10Y (Gilt)', basePrice: 98.60 }
    ]
  }
};

export default function App() {
  const [markets, setMarkets] = useState(DEFAULT_MARKETS);
  const [activeMarketKey, setActiveMarketKey] = useState('blips');
  const [activeSymbol, setActiveSymbol] = useState('BLIP-VOL-100');
  const [activeAssetName, setActiveAssetName] = useState('Índice Blip Volatilidad 100');
  
  const [candles, setCandles] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [signalsHistory, setSignalsHistory] = useState([]);
  
  const [trialStatus, setTrialStatus] = useState({
    isTrialActive: true,
    isSubscribed: false,
    requiresPaywall: false,
    daysLeft: 1,
    hoursLeft: 23,
    minutesLeft: 59,
    secondsLeft: 59,
    totalSecondsLeft: 172800,
    trialEndsAt: Date.now() + 172800000
  });
  
  const [user, setUser] = useState({ id: 'user_demo_001', name: 'Trader VIP Demo', email: 'demo@trader.ai' });
  const [activeStrategy, setActiveStrategy] = useState('daytrading');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [notification, setNotification] = useState(null);

  const activeSymbolRef = useRef(activeSymbol);
  activeSymbolRef.current = activeSymbol;
  const activeStrategyRef = useRef(activeStrategy);
  activeStrategyRef.current = activeStrategy;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Cargar mercados desde backend
  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/markets');
      if (res.ok) {
        const data = await res.json();
        if (data.markets) setMarkets(data.markets);
      }
    } catch (e) {
      console.warn('Usando configuración local de mercados', e);
    }
  }, []);

  // 2. Cargar estado de usuario y prueba de 2 días
  const fetchUserStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/user/status', {
        headers: { 'x-user-id': user.id }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status) setTrialStatus(data.status);
        if (data.user) setUser(prev => ({ ...prev, ...data.user }));
      }
    } catch (e) {
      console.warn('Error fetching user status', e);
    }
  }, [user.id]);

  // 3. Cargar velas y precio actual del activo
  const fetchCandlesAndPrice = useCallback(async (symbol) => {
    try {
      const res = await fetch(`/api/market/${symbol}/candles`);
      if (res.ok) {
        const data = await res.json();
        setCandles(data.candles || []);
        setCurrentPrice(data.currentPrice);
        if (data.name) setActiveAssetName(data.name);
      }
    } catch (e) {
      console.warn('Error fetching candles', e);
    }
  }, []);

  // 4. Cargar análisis y probabilidades de la IA con Estrategia
  const fetchAIPrediction = useCallback(async (symbol, strat) => {
    const strategyToUse = strat || activeStrategyRef.current;
    try {
      setIsReanalyzing(true);
      const res = await fetch(`/api/ai/predict/${symbol}?strategy=${strategyToUse}`, {
        headers: { 'x-user-id': user.id }
      });
      
      if (res.status === 403) {
        const data = await res.json();
        if (data.requiresPaywall) {
          setTrialStatus(prev => ({ ...prev, requiresPaywall: true, isTrialActive: false }));
          setIsPaywallOpen(true);
        }
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPrediction(data.prediction);
        if (data.trialStatus) setTrialStatus(data.trialStatus);
      }
    } catch (e) {
      console.warn('Error fetching prediction', e);
    } finally {
      setIsReanalyzing(false);
    }
  }, [user.id]);

  // 5. Cargar historial de señales
  const fetchSignalsHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/signals/history');
      if (res.ok) {
        const data = await res.json();
        if (data.signals) setSignalsHistory(data.signals);
      }
    } catch (e) {
      console.warn('Error fetching signals history', e);
    }
  }, []);

  // Inicialización
  useEffect(() => {
    fetchMarkets();
    fetchUserStatus();
    fetchCandlesAndPrice(activeSymbol);
    fetchAIPrediction(activeSymbol, activeStrategy);
    fetchSignalsHistory();
  }, []);

  // Cambio de símbolo
  const handleSelectSymbol = (symbol) => {
    setActiveSymbol(symbol);
    // Buscar nombre
    let foundName = symbol;
    for (const m of Object.values(markets)) {
      const a = m.assets?.find(x => x.symbol === symbol);
      if (a) { foundName = a.name; break; }
    }
    setActiveAssetName(foundName);
    fetchCandlesAndPrice(symbol);
    fetchAIPrediction(symbol, activeStrategyRef.current);
  };

  const handleSelectMarket = (marketKey) => {
    setActiveMarketKey(marketKey);
    const firstAsset = markets[marketKey]?.assets?.[0];
    if (firstAsset) {
      handleSelectSymbol(firstAsset.symbol);
    }
  };

  // Intervalo de datos en tiempo real (ticks de precio cada 650ms para movimiento ultra-rápido)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      fetchCandlesAndPrice(activeSymbolRef.current);
    }, 650);
    return () => clearInterval(tickInterval);
  }, [fetchCandlesAndPrice]);

  // Contador regresivo en tiempo real de los 2 días (cada 1s)
  useEffect(() => {
    const timer = setInterval(() => {
      setTrialStatus(prev => {
        if (!prev || prev.isSubscribed || !prev.trialEndsAt) return prev;
        const now = Date.now();
        const diff = prev.trialEndsAt - now;
        if (diff <= 0) {
          return {
            ...prev,
            isTrialActive: false,
            requiresPaywall: true,
            daysLeft: 0,
            hoursLeft: 0,
            minutesLeft: 0,
            secondsLeft: 0,
            totalSecondsLeft: 0
          };
        }
        const totalSecondsLeft = Math.floor(diff / 1000);
        const daysLeft = Math.floor(totalSecondsLeft / 86400);
        const hoursLeft = Math.floor((totalSecondsLeft % 86400) / 3600);
        const minutesLeft = Math.floor((totalSecondsLeft % 3600) / 60);
        const secondsLeft = totalSecondsLeft % 60;
        return {
          ...prev,
          daysLeft,
          hoursLeft,
          minutesLeft,
          secondsLeft,
          totalSecondsLeft
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular Expiración de los 2 Días o Restaurar
  const handleToggleForceExpire = async () => {
    const newExpireState = !trialStatus.requiresPaywall;
    try {
      const res = await fetch('/api/user/toggle-trial-expired', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ forceExpire: newExpireState })
      });
      if (res.ok) {
        const data = await res.json();
        setTrialStatus(data.status);
        if (newExpireState) {
          setIsPaywallOpen(true);
          showNotification('Has simulado la expiración del periodo de 2 días. El Paywall se ha activado.');
        } else {
          showNotification('¡Prueba de 2 días restaurada con éxito!');
          fetchAIPrediction(activeSymbol);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Suscribirse a un plan de cobro
  const handleSubscribe = async (plan) => {
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ plan })
      });
      if (res.ok) {
        const data = await res.json();
        setTrialStatus(data.status);
        if (data.user) setUser(data.user);
        setIsPaywallOpen(false);
        showNotification(data.message || `¡Plan ${plan.toUpperCase()} activado con éxito!`);
        fetchAIPrediction(activeSymbol);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Re-escanear con IA
  const handleManualReanalyze = () => {
    fetchAIPrediction(activeSymbol);
    fetchSignalsHistory();
    showNotification(`IA recalculando probabilidades en tiempo real para ${activeSymbol}...`);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notificación */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Barra de Navegación Superior con 2 Días de Prueba */}
      <Navbar
        trialStatus={trialStatus}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onToggleForceExpire={handleToggleForceExpire}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        user={user}
      />

      {/* 2. Ticker de Estado de los 12 Mercados */}
      <div className="bg-slate-950 border-b border-slate-850 py-1.5 px-4 text-[11px] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-6">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>MOTOR CUANTITATIVO ACTIVO EN 12 MERCADOS</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-slate-400">
          <span className="text-slate-300">⚡ Blips 60s: <strong className="text-emerald-400">CALL 78%</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🪙 BTC/USD 24/7: <strong className="text-cyan-400">$89,450</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">📊 Digital EUR/USD: <strong className="text-rose-400">PUT 69%</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">💎 Oro Spot Prime: <strong className="text-amber-400">$2,895.50</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🛢️ Petróleo Brent: <strong className="text-emerald-400">$75.80</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🌾 MATIF Trigo: <strong className="text-emerald-400">218.50 €</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">☕ Café Arábica: <strong className="text-amber-300">$245.50</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🏛️ Bono US 10Y: <strong className="text-slate-200">112.45</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🚀 NVDA CFD: <strong className="text-cyan-400">$138.50</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">📈 US30 CFD: <strong className="text-emerald-400">42,450</strong></span>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 space-y-4">
        {/* 3. Selector de los 12 Mercados y sus Activos */}
        <MarketSelector
          markets={markets}
          activeMarketKey={activeMarketKey}
          onSelectMarket={handleSelectMarket}
          activeSymbol={activeSymbol}
          onSelectSymbol={handleSelectSymbol}
        />

        {/* 4. Barra de Control del Activo Activo + Botón Re-analizar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              {activeSymbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">{activeSymbol}</h2>
                <span className="text-xs text-slate-400 font-medium">({activeAssetName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono uppercase">
                  {activeMarketKey}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Precio en vivo:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  ${currentPrice || '---'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualReanalyze}
              disabled={isReanalyzing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-sm transition transform active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isReanalyzing ? 'Calculando Probabilidad...' : 'Re-analizar con IA'}</span>
            </button>

            {!trialStatus.isSubscribed && (
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Ver Planes</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. Grilla Principal: Gráfico en Vivo (Izquierda) vs Análisis y Probabilidad IA (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Gráfico de Velas Japonesas */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ChartView
              symbol={activeSymbol}
              name={activeAssetName}
              candles={candles}
              currentPrice={currentPrice}
              marketType={activeMarketKey}
            />
          </div>

          {/* Tarjeta de Inteligencia Artificial: Probabilidades y Señal */}
          <div className="lg:col-span-5 xl:col-span-5">
            <AIPredictionCard
              prediction={prediction}
              currentPrice={currentPrice}
              requiresPaywall={trialStatus.requiresPaywall}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onReanalyze={handleManualReanalyze}
              selectedStrategy={activeStrategy}
              onSelectStrategy={(strat) => {
                setActiveStrategy(strat);
                fetchAIPrediction(activeSymbol, strat);
                showNotification(`Estrategia IA cambiada a ${strat === 'scalping' ? '⚡ Scalping Turbo (1-5m)' : strat === 'swing_smc' ? '🛡️ Swing SMC Institucional' : '🎯 Day Trading Intradiario'}`);
              }}
            />
          </div>
        </div>

        {/* 6. Historial de Señales Multimercado en Tiempo Real */}
        <div className="pt-2">
          <SignalHistory signals={signalsHistory} />
        </div>
      </main>

      {/* 7. Footer Informativo con Descargo de Responsabilidad */}
      <footer className="mt-8 border-t border-slate-850 bg-slate-950 py-6 px-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-400">
            NEXUS AI TRADING SUITE &bull; Plataforma Cuantitativa Multimercado (7 Mercados)
          </p>
          <p className="text-[11px] text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Aviso de Riesgo y Probabilidad: La Inteligencia Artificial analiza patrones históricos, volumen, medias móviles exponenciales y confluencias estadísticas para proyectar el escenario de mayor probabilidad matemática (Subida vs Bajada). El trading de Blips, Opciones Digitales, Forex, Acciones, ETFs, Índices y Materias Primas CFD conlleva riesgo sustancial de capital. Opere únicamente con fondos destinados a inversión de riesgo y emplee stop loss responsablemente.
          </p>
          <p className="text-[10px] text-slate-700 font-mono">
            Periodo de Prueba Gratuita: 2 Días (48 Horas) para nuevos registros &bull; Planes Pro desde $29/mes
          </p>
        </div>
      </footer>

      {/* Modal de Paywall y Suscripción */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSubscribe={handleSubscribe}
        isExpired={trialStatus.requiresPaywall}
      />

      {/* Modal de Autenticación / Registro de Usuario */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Perfil de Trader</h3>
                <p className="text-xs text-slate-400">Prueba de 2 días activada para esta cuenta</p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Usuario:</span>
                <span className="text-slate-300 font-bold">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nombre:</span>
                <span className="text-slate-300">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-300">{user.email}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-850">
                <span className="text-slate-500">Plan:</span>
                <span className="text-emerald-400 font-bold">
                  {trialStatus.isSubscribed ? trialStatus.subscriptionPlan : 'PRUEBA GRATIS (2 DÍAS)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAuthOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 7. Modal Exclusivo del Dueño / Admin */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
