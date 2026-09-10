import React from 'react';
import { Sparkles, Clock, ShieldCheck, Crown, Zap, User, AlertCircle, RefreshCw } from 'lucide-react';

export default function Navbar({ trialStatus, onOpenPaywall, onToggleForceExpire, onOpenAuth, onOpenAdmin, user }) {
  const isSubscribed = trialStatus?.isSubscribed;
  const isTrialActive = trialStatus?.isTrialActive;
  const requiresPaywall = trialStatus?.requiresPaywall;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                NEXUS AI TRADING
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                12 Mercados
              </span>
            </div>
            <p className="text-xs text-slate-400">Inteligencia Artificial Predictiva & Confluencia Estadística</p>
          </div>
        </div>

        {/* Trial Countdown & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge de Estado del Periodo de Prueba */}
          {isSubscribed ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Crown className="w-4 h-4 text-emerald-400" />
              <span>PLAN PRO ACTIVO</span>
            </div>
          ) : isTrialActive ? (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="font-semibold text-slate-200">Prueba 2 Días: </span>
                <span className="font-mono font-bold text-amber-400">
                  {trialStatus.daysLeft}d {trialStatus.hoursLeft}h {trialStatus.minutesLeft}m {trialStatus.secondsLeft}s
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Prueba de 2 Días Expirada</span>
            </div>
          )}

          {/* Simulador para testing del Paywall */}
          <button
            onClick={onToggleForceExpire}
            title="Simular cómo ve el usuario la app cuando expira la prueba de 2 días"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {requiresPaywall ? 'Restaurar 2 Días' : 'Simular Expiración'}
            </span>
          </button>

          {/* Botón Panel del Dueño / Admin */}
          <button
            onClick={onOpenAdmin}
            title="Panel de Control Exclusivo para el Dueño (Abel Pacheco Santacruz)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-black transition transform hover:scale-105 shadow-sm shadow-amber-500/10"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>👑 Panel Dueño</span>
          </button>

          {/* Botón de Actualización / Comprar */}
          <button
            onClick={onOpenPaywall}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isSubscribed ? 'Gestionar Plan' : 'Desbloquear Pro'}</span>
          </button>

          {/* Usuario Demo */}
          <div 
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-slate-200">{user?.name || 'Trader VIP'}</p>
              <p className="text-[10px] text-emerald-400 font-mono">Conectado</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
