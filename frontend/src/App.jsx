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
  blitz: {
    name: 'Blitz IQ Option',
    description: 'Opciones ultrarrápidas de IQ Option (5s a 60s) con los mayores payouts de la app (hasta 95%).',
    badge: 'Turbo 95% Payout',
    assets: [
      { symbol: 'EURUSD-BLITZ', name: 'EUR/USD (Blitz IQ Option)', basePrice: 1.0845, payout: 95, isOTC: false },
      { symbol: 'GBPUSD-BLITZ', name: 'GBP/USD (Blitz IQ Option)', basePrice: 1.2980, payout: 92, isOTC: false },
      { symbol: 'USDJPY-BLITZ', name: 'USD/JPY (Blitz IQ Option)', basePrice: 154.20, payout: 90, isOTC: false },
      { symbol: 'AUDCAD-BLITZ', name: 'AUD/CAD (Blitz IQ Option)', basePrice: 0.9025, payout: 91, isOTC: false },
      { symbol: 'BTCUSD-BLITZ', name: 'Bitcoin (Blitz IQ Option)', basePrice: 89450.00, payout: 94, isOTC: false },
      { symbol: 'GOLD-BLITZ', name: 'Gold / Oro (Blitz IQ Option)', basePrice: 2895.50, payout: 93, isOTC: false },
      { symbol: 'EURUSD-OTC-BLITZ', name: 'EUR/USD (OTC) Blitz 24/7', basePrice: 1.0842, payout: 95, isOTC: true },
      { symbol: 'GBPUSD-OTC-BLITZ', name: 'GBP/USD (OTC) Blitz 24/7', basePrice: 1.2975, payout: 93, isOTC: true }
    ]
  },
  digital: {
    name: 'Digitales IQ Option',
    description: 'Opciones digitales de IQ Option con expiraciones de 1m, 5m y 15m y strikes dinámicos.',
    badge: 'Digital 94% Payout',
    assets: [
      { symbol: 'DIGITAL-EURUSD', name: 'EUR/USD Digital IQ Option', basePrice: 1.0845, payout: 94, isOTC: false },
      { symbol: 'DIGITAL-GBPUSD', name: 'GBP/USD Digital IQ Option', basePrice: 1.2980, payout: 92, isOTC: false },
      { symbol: 'DIGITAL-USDJPY', name: 'USD/JPY Digital IQ Option', basePrice: 154.20, payout: 91, isOTC: false },
      { symbol: 'DIGITAL-EURJPY', name: 'EUR/JPY Digital IQ Option', basePrice: 167.25, payout: 90, isOTC: false },
      { symbol: 'DIGITAL-AUDUSD', name: 'AUD/USD Digital IQ Option', basePrice: 0.6550, payout: 92, isOTC: false },
      { symbol: 'DIGITAL-GBPJPY', name: 'GBP/JPY Digital IQ Option', basePrice: 199.80, payout: 89, isOTC: false },
      { symbol: 'DIGITAL-EURUSD-OTC', name: 'EUR/USD (OTC) Digital 24/7', basePrice: 1.0842, payout: 95, isOTC: true },
      { symbol: 'DIGITAL-GBPUSD-OTC', name: 'GBP/USD (OTC) Digital 24/7', basePrice: 1.2975, payout: 93, isOTC: true }
    ]
  },
  forex: {
    name: 'Forex CFD IQ Option',
    description: 'Pares de divisas oficiales de IQ Option con multiplicadores de apalancamiento x50 hasta x1000.',
    badge: 'Multiplicador x1000',
    assets: [
      { symbol: 'EURUSD', name: 'EUR/USD (Forex IQ Option)', basePrice: 1.0845, multiplier: 'x1000', isOTC: false },
      { symbol: 'GBPUSD', name: 'GBP/USD (Forex IQ Option)', basePrice: 1.2980, multiplier: 'x1000', isOTC: false },
      { symbol: 'USDJPY', name: 'USD/JPY (Forex IQ Option)', basePrice: 154.20, multiplier: 'x1000', isOTC: false },
      { symbol: 'AUDUSD', name: 'AUD/USD (Forex IQ Option)', basePrice: 0.6550, multiplier: 'x500', isOTC: false },
      { symbol: 'USDCAD', name: 'USD/CAD (Forex IQ Option)', basePrice: 1.3910, multiplier: 'x500', isOTC: false },
      { symbol: 'EURGBP', name: 'EUR/GBP (Forex IQ Option)', basePrice: 0.8355, multiplier: 'x500', isOTC: false },
      { symbol: 'NZDUSD', name: 'NZD/USD (Forex IQ Option)', basePrice: 0.5920, multiplier: 'x500', isOTC: false },
      { symbol: 'EURUSD-OTC', name: 'EUR/USD (OTC Forex IQ Option)', basePrice: 1.0842, multiplier: 'x500', isOTC: true }
    ]
  },
  acciones: {
    name: 'Acciones CFD IQ Option',
    description: 'CFDs sobre las principales acciones de Wall Street negociadas en IQ Option con multiplicador x20.',
    badge: 'Multiplicador x20',
    assets: [
      { symbol: 'TSLA', name: 'Tesla Inc. CFD IQ Option', basePrice: 265.40, multiplier: 'x20', isOTC: false },
      { symbol: 'AAPL', name: 'Apple Inc. CFD IQ Option', basePrice: 228.30, multiplier: 'x20', isOTC: false },
      { symbol: 'NVDA', name: 'NVIDIA Corp. CFD IQ Option', basePrice: 138.50, multiplier: 'x20', isOTC: false },
      { symbol: 'AMZN', name: 'Amazon.com Inc. CFD IQ Option', basePrice: 186.20, multiplier: 'x20', isOTC: false },
      { symbol: 'MSFT', name: 'Microsoft Corp. CFD IQ Option', basePrice: 422.10, multiplier: 'x20', isOTC: false },
      { symbol: 'META', name: 'Meta Platforms Inc. CFD IQ Option', basePrice: 585.60, multiplier: 'x20', isOTC: false },
      { symbol: 'NFLX', name: 'Netflix Inc. CFD IQ Option', basePrice: 695.20, multiplier: 'x20', isOTC: false },
      { symbol: 'GOOGL', name: 'Alphabet (Google) CFD IQ Option', basePrice: 178.40, multiplier: 'x20', isOTC: false },
      { symbol: 'AMD', name: 'Advanced Micro Devices CFD IQ Option', basePrice: 156.80, multiplier: 'x20', isOTC: false }
    ]
  },
  etf: {
    name: 'ETF CFD IQ Option',
    description: 'Fondos cotizados en bolsa oficiales disponibles en IQ Option que rastrean los principales índices.',
    badge: 'Multiplicador x20',
    assets: [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF IQ Option', basePrice: 574.80, multiplier: 'x20', isOTC: false },
      { symbol: 'QQQ', name: 'Invesco QQQ (Nasdaq 100) IQ Option', basePrice: 489.20, multiplier: 'x20', isOTC: false },
      { symbol: 'DIA', name: 'SPDR Dow Jones Industrial IQ Option', basePrice: 422.50, multiplier: 'x20', isOTC: false },
      { symbol: 'XLF', name: 'Financial Select Sector SPDR IQ Option', basePrice: 47.60, multiplier: 'x20', isOTC: false },
      { symbol: 'EEM', name: 'iShares MSCI Emerging Markets IQ Option', basePrice: 44.80, multiplier: 'x20', isOTC: false }
    ]
  },
  indices: {
    name: 'Índices CFD IQ Option',
    description: 'Contratos por diferencia de los índices bursátiles más importantes del mundo en IQ Option.',
    badge: 'Multiplicador x150',
    assets: [
      { symbol: 'US30', name: 'Dow Jones 30 (US 30 CFD IQ Option)', basePrice: 42450.00, multiplier: 'x150', isOTC: false },
      { symbol: 'NAS100', name: 'Nasdaq 100 (Tech 100 CFD IQ Option)', basePrice: 20420.00, multiplier: 'x150', isOTC: false },
      { symbol: 'SPX500', name: 'S&P 500 CFD IQ Option', basePrice: 5760.00, multiplier: 'x150', isOTC: false },
      { symbol: 'GER40', name: 'Alemania 40 (DAX CFD IQ Option)', basePrice: 19480.00, multiplier: 'x100', isOTC: false },
      { symbol: 'UK100', name: 'Reino Unido 100 (FTSE CFD IQ Option)', basePrice: 8250.00, multiplier: 'x100', isOTC: false },
      { symbol: 'NIKKEI225', name: 'Japón 225 (Nikkei CFD IQ Option)', basePrice: 38850.00, multiplier: 'x100', isOTC: false }
    ]
  },
  materias_primas: {
    name: 'Materias Primas IQ Option',
    description: 'Commodities oficiales de la app IQ Option (Metales y Energías) con multiplicador hasta x100.',
    badge: 'Multiplicador x100',
    assets: [
      { symbol: 'XAUUSD', name: 'Oro Spot (Gold / USD CFD IQ Option)', basePrice: 2895.50, multiplier: 'x100', isOTC: false },
      { symbol: 'WTI', name: 'Petróleo Crudo WTI CFD IQ Option', basePrice: 71.40, multiplier: 'x50', isOTC: false },
      { symbol: 'BRENT', name: 'Petróleo Crudo Brent CFD IQ Option', basePrice: 75.80, multiplier: 'x50', isOTC: false },
      { symbol: 'XAGUSD', name: 'Plata Spot (Silver / USD CFD IQ Option)', basePrice: 34.20, multiplier: 'x50', isOTC: false },
      { symbol: 'NATGAS', name: 'Gas Natural CFD IQ Option', basePrice: 2.850, multiplier: 'x20', isOTC: false },
      { symbol: 'PLATINUM', name: 'Platino Spot (Platinum CFD IQ Option)', basePrice: 985.00, multiplier: 'x50', isOTC: false },
      { symbol: 'GOLD-OTC', name: 'Oro (OTC Gold CFD IQ Option)', basePrice: 2895.10, multiplier: 'x100', isOTC: true }
    ]
  }
};

export default function App() {
  const [markets, setMarkets] = useState(DEFAULT_MARKETS);
  const [activeMarketKey, setActiveMarketKey] = useState('blitz');
  const [activeSymbol, setActiveSymbol] = useState('EURUSD-BLITZ');
  const [activeAssetName, setActiveAssetName] = useState('EUR/USD (Blitz IQ Option)');
  
  const [candles, setCandles] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [signalsHistory, setSignalsHistory] = useState([]);
  
  // Prueba de 3 días garantizada (72 horas = 259,200 segundos)
  const [trialStatus, setTrialStatus] = useState({
    isTrialActive: true,
    isSubscribed: false,
    requiresPaywall: false,
    daysLeft: 2,
    hoursLeft: 23,
    minutesLeft: 59,
    secondsLeft: 59,
    totalSecondsLeft: 259200,
    trialEndsAt: Date.now() + 259200000
  });
  
  const [user, setUser] = useState({ id: 'user_demo_001', name: 'Trader VIP Demo', email: 'demo@trader.ai' });
  const [activeStrategy, setActiveStrategy] = useState('daytrading');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [feedSource, setFeedSource] = useState('IQ Option Live Real-Time Feed');
  const [realExchange, setRealExchange] = useState('IQ-BLITZ');
  const [realStats, setRealStats] = useState(null);

  // Modal de Autenticación
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState(null);

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
      console.warn('Usando configuración local de mercados IQ Option', e);
    }
  }, []);

  // 2. Cargar estado de usuario y prueba de 3 días
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
        if (data.feedSource) setFeedSource(data.feedSource);
        if (data.realExchange) setRealExchange(data.realExchange);
        if (data.realStats) setRealStats(data.realStats);
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

  // Intervalo de datos ultra-rápido en tiempo real (ticks de precio cada 250ms)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      fetchCandlesAndPrice(activeSymbolRef.current);
    }, 250);
    return () => clearInterval(tickInterval);
  }, [fetchCandlesAndPrice]);

  // Contador regresivo en tiempo real de los 3 días
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

  // Simular Expiración de los 3 Días o Restaurar
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
          showNotification('Has simulado la expiración del periodo de 3 días. El Paywall se ha activado.');
        } else {
          showNotification('¡Prueba de 3 días restaurada con éxito!');
          fetchAIPrediction(activeSymbol);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Suscribirse a un plan
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
        showNotification(data.message || '¡Suscripción Pro activada exitosamente!');
        fetchAIPrediction(activeSymbol);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Login o Registro
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || 'Error en autenticación');
        return;
      }
      setUser(data.user);
      if (data.trialStatus) setTrialStatus(data.trialStatus);
      setIsAuthOpen(false);
      showNotification(`¡Bienvenido, ${data.user.name}! 3 días de acceso gratuito activados.`);
      fetchAIPrediction(activeSymbol);
    } catch (err) {
      setAuthError('Error conectando con el servidor');
    }
  };

  const handleManualReanalyze = () => {
    fetchAIPrediction(activeSymbol, activeStrategy);
    showNotification('Recalculando probabilidades con datos en tiempo real de IQ Option...');
  };

  const activeAssetObj = markets[activeMarketKey]?.assets?.find(a => a.symbol === activeSymbol);
  const activePayout = activeAssetObj?.payout || prediction?.executionDetails?.payout || (activeMarketKey === 'blitz' ? 95 : activeMarketKey === 'digital' ? 94 : null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Notificación Flotante */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs border border-emerald-400 animate-in slide-in-from-top duration-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Barra de Navegación Principal */}
      <Navbar
        trialStatus={trialStatus}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onToggleForceExpire={handleToggleForceExpire}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        user={user}
      />

      {/* 2. Barra Ticker Oficial de Mercados IQ Option en Vivo */}
      <div className="bg-slate-950 border-b border-slate-850 py-1.5 px-4 text-[11px] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-6">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>MOTOR CUANTITATIVO EN VIVO: 7 MERCADOS DE IQ OPTION</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-slate-400">
          <span className="text-slate-300">⚡ Blitz EUR/USD: <strong className="text-emerald-400">SUBE 78% (95% Payout)</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">💎 Digital GBP/USD: <strong className="text-rose-400">BAJA 69% (92% Payout)</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">💱 Forex EUR/USD: <strong className="text-cyan-400">Multiplicador x1000</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">📈 TSLA CFD: <strong className="text-emerald-400">SUBE (x20)</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🏛️ US 30 CFD: <strong className="text-emerald-400">SUBE (x150)</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🛢️ Oro Spot: <strong className="text-amber-400">$2,895.50 (x100)</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">🕒 EUR/USD (OTC): <strong className="text-emerald-400">OTC 24/7 95%</strong></span>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 space-y-4">
        {/* 3. Selector de los 7 Mercados de IQ Option y sus Activos */}
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
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold text-sm">
              {activeSymbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">{activeSymbol}</h2>
                <span className="text-xs text-slate-400 font-medium">({activeAssetName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-mono uppercase">
                  IQ OPTION {activeMarketKey}
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Desbloquear Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. Grilla Principal: Gráfico en Vivo (Izquierda) vs Análisis y Probabilidad IA IQ Option (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Gráfico de Velas Japonesas IQ Option */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ChartView
              symbol={activeSymbol}
              name={activeAssetName}
              candles={candles}
              currentPrice={currentPrice}
              marketType={activeMarketKey}
              feedSource={feedSource}
              realExchange={realExchange}
              realStats={realStats}
              payout={activePayout}
            />
          </div>

          {/* Tarjeta de Inteligencia Artificial: Probabilidades y Botones SUBE / BAJA IQ Option */}
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
                showNotification(`Estrategia IA cambiada a ${strat === 'scalping' ? '⚡ Scalping Turbo (5s-1m)' : strat === 'swing_smc' ? '🛡️ SMC Institucional' : '🎯 Confluencia (5m-15m)'}`);
              }}
            />
          </div>
        </div>

        {/* 6. Historial de Señales IQ Option en Tiempo Real */}
        <div className="pt-2">
          <SignalHistory signals={signalsHistory} />
        </div>
      </main>

      {/* 7. Footer Informativo */}
      <footer className="mt-8 border-t border-slate-850 bg-slate-950 py-6 px-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-400">
            NEXUS AI TRADING SUITE &bull; Plataforma Especializada en los 7 Mercados de IQ Option
          </p>
          <p className="text-[11px] text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Blitz (5s - 60s), Digitales, Forex CFD con Margen, Acciones CFD, ETF CFD, Índices CFD y Materias Primas CFD en tiempo real. Análisis cuantitativo multi-indicador con cálculo probabilístico de Subida / Bajada y 3 días de prueba gratuita.
          </p>
        </div>
      </footer>

      {/* Modales */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSubscribe={handleSubscribe}
        isExpired={trialStatus.requiresPaywall}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onConfigUpdated={() => {
          showNotification('Configuración del sistema actualizada correctamente.');
        }}
      />

      {/* Modal de Login / Registro */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 text-slate-950 font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {authMode === 'login' ? 'Iniciar Sesión en Nexus AI' : 'Crear Cuenta de Trader'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'login' 
                  ? 'Accede a tus señales y análisis en tiempo real de IQ Option'
                  : 'Recibe 3 DÍAS GRATIS de acceso total a las probabilidades de la IA'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="trader@ejemplo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
              >
                {authMode === 'login' ? 'Entrar a la Plataforma' : 'Comenzar 3 Días de Prueba Gratis'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
              {authMode === 'login' ? (
                <p>
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Regístrate con 3 Días Gratis
                  </button>
                </p>
              ) : (
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Inicia Sesión
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
