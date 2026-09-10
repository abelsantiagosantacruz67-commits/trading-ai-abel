import React, { useState, useEffect } from 'react';
import { 
  X, Check, Zap, Crown, ShieldCheck, Sparkles, 
  Tag, Copy, CheckCheck, ExternalLink, Settings,
  AlertCircle, Smartphone, Send, ArrowRight
} from 'lucide-react';

export default function PaywallModal({ isOpen, onClose, onSubscribe, isExpired }) {
  const [activeTab, setActiveTab] = useState('planes'); // 'planes', 'nequi', 'paypal'
  const [selectedPlan, setSelectedPlan] = useState('trimestral');
  const [copiedText, setCopiedText] = useState(false);
  
  // Nequi state
  const [nequiApprovalCode, setNequiApprovalCode] = useState('');
  const [nequiPhone, setNequiPhone] = useState('312 620 2703');
  const [nequiName, setNequiName] = useState('Abel Pacheco Santacruz');
  
  // PayPal state
  const [paypalTxId, setPaypalTxId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('abelsantiagosantacruz67@gmail.com');
  const [paypalMe, setPaypalMe] = useState('https://paypal.me/abelpachecosantacruz');

  // Config settings modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempPhone, setTempPhone] = useState(nequiPhone);
  const [tempName, setTempName] = useState(nequiName);
  const [tempEmail, setTempEmail] = useState(paypalEmail);
  const [tempPaypalMe, setTempPaypalMe] = useState(paypalMe);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Cargar configuración de cuentas de cobro desde el backend
  useEffect(() => {
    fetch('/api/payment-config')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          if (data.config.nequi) {
            setNequiPhone(data.config.nequi.phone);
            setNequiName(data.config.nequi.accountName);
            setTempPhone(data.config.nequi.phone);
            setTempName(data.config.nequi.accountName);
          }
          if (data.config.paypal) {
            setPaypalEmail(data.config.paypal.email);
            setPaypalMe(data.config.paypal.paypalMe);
            setTempEmail(data.config.paypal.email);
            setTempPaypalMe(data.config.paypal.paypalMe);
          }
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'pase_24h',
      name: 'Pase 24 Horas',
      priceUSD: 7,
      priceCOP: '28.000',
      period: '/día',
      badge: 'MICRO-PASE',
      description: 'Acceso total por 24 horas para operar noticias y volatilidad.',
      features: [
        'Acceso completo a los 12 mercados por 24h',
        'Señales y probabilidades de IA en tiempo real',
        'Blips, Digitales, Forex y Crypto 24/7'
      ]
    },
    {
      id: 'mensual',
      name: 'Plan Mensual Pro',
      priceUSD: 29,
      priceCOP: '116.000',
      period: '/mes',
      description: 'Acceso ilimitado mes a mes para traders activos.',
      features: [
        'Acceso total a los 12 mercados financieros',
        'Probabilidades de Subida/Bajada en tiempo real',
        'Opciones Blips y Digitales (30s - 15m)',
        'CFDs: Forex, Crypto 24/7, Acciones, Energías, Bonos',
        'Stop Loss y Take Profit recomendados'
      ]
    },
    {
      id: 'trimestral',
      name: 'Plan Trimestral Pro',
      priceUSD: 69,
      priceCOP: '276.000',
      period: '/3 meses',
      badge: 'MÁS POPULAR • AHORRA 20%',
      popular: true,
      description: 'La opción recomendada para traders consistentes.',
      features: [
        'Todo lo incluido en el Plan Mensual',
        'Prioridad de ejecución en señales cuantitativas',
        'Filtro avanzado de confluencias de IA',
        'Acceso a nuevos algoritmos y métricas',
        'Soporte prioritario directo'
      ]
    },
    {
      id: 'anual',
      name: 'Plan VIP Institucional',
      priceUSD: 199,
      priceCOP: '796.000',
      period: '/año',
      badge: 'MEJOR VALOR • AHORRA 45%',
      description: 'Para traders avanzados e inversores de alto rendimiento.',
      features: [
        'Todo lo del Plan Trimestral',
        'Acceso multiventana ilimitado a los 12 mercados',
        'Canal VIP privado de alertas de Telegram',
        'Webhooks de señales para bots / automatizaciones',
        'Garantía de actualización continua de IA'
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[2];
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  
  const finalPriceUSD = (currentPlan.priceUSD * (1 - discountPercent / 100)).toFixed(2);
  const rawCOP = parseInt(currentPlan.priceCOP.replace('.', ''), 10);
  const finalPriceCOP = Math.round(rawCOP * (1 - discountPercent / 100)).toLocaleString('es-CO');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleApplyCoupon = async () => {
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data);
        if (data.discountPercent === 100) {
          handleExecutePayment('coupon', { couponCode: data.code });
        }
      } else {
        setCouponError(data.message || 'Cupón inválido');
      }
    } catch {
      setCouponError('Error al validar cupón');
    }
  };

  const handleSavePaymentConfig = async () => {
    try {
      const res = await fetch('/api/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nequiPhone: tempPhone,
          nequiName: tempName,
          paypalEmail: tempEmail,
          paypalMe: tempPaypalMe
        })
      });
      const data = await res.json();
      if (data.success) {
        setNequiPhone(tempPhone);
        setNequiName(tempName);
        setPaypalEmail(tempEmail);
        setPaypalMe(tempPaypalMe);
        setShowConfigModal(false);
        alert('¡Cuentas de cobro actualizadas! Ahora todos los pagos se enviarán a tus datos.');
      }
    } catch {
      alert('Error al guardar datos');
    }
  };

  const handleExecutePayment = async (method = 'nequi', extraDetails = {}) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          method,
          paymentDetails: {
            ...extraDetails,
            amountUSD: finalPriceUSD,
            amountCOP: finalPriceCOP
          },
          couponCode: appliedCoupon?.code
        })
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.success) {
        setSuccessMessage(`¡Pago confirmado con éxito! Has activado el plan ${selectedPlan.toUpperCase()}.`);
        setTimeout(() => {
          onSubscribe(selectedPlan);
          setSuccessMessage(null);
          onClose();
        }, 1400);
      } else {
        alert(data.message || 'Error al procesar el pago');
      }
    } catch {
      setIsProcessing(false);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 md:p-8 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Glow decorativo morado Nequi / azul PayPal */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar y Configurar */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            title="Configurar tu número de Nequi o cuenta de PayPal donde recibirás el dinero"
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-cyan-300 hover:bg-slate-750 transition flex items-center gap-1 text-xs"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-medium pr-1">Configurar Cuentas</span>
          </button>

          {!isExpired && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Crown className="w-4 h-4" />
            <span>NEXUS AI TRADING SUITE &bull; MEDIOS DE PAGO OFICIALES</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {isExpired ? 'Tu periodo de prueba de 2 días ha expirado' : 'Elige tu Plan y Realiza tu Pago'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Recibe acceso total e ilimitado a las probabilidades de la IA en los 12 mercados. Pago directo por <strong className="text-fuchsia-400">Nequi Colombia</strong> o <strong className="text-sky-400">PayPal</strong>.
          </p>
        </div>

        {/* Pestañas Exclusivas de Pago */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 border-b border-slate-800 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('planes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === 'planes' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1. Seleccionar Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('nequi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === 'nequi' 
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-lg shadow-fuchsia-500/10' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-fuchsia-600 flex items-center justify-center text-[9px] font-black text-white">N</div>
            <span>2. Nequi Colombia (COP)</span>
          </button>

          <button
            onClick={() => setActiveTab('paypal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === 'paypal' 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg shadow-sky-500/10' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-sky-600 flex items-center justify-center text-[9px] font-black text-white">P</div>
            <span>3. PayPal (USD)</span>
          </button>
        </div>

        {/* Mensaje de Éxito */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-center font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* PESTAÑA 1: SELECCIÓN DE PLANES CON DÓLARES Y PESOS COLOMBIANOS */}
        {activeTab === 'planes' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`cursor-pointer relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-850 border-emerald-500 shadow-xl shadow-emerald-500/15 scale-[1.02]'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow">
                        {p.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white text-sm">{p.name}</h3>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mb-3">{p.description}</p>

                      <div className="mb-1">
                        <span className="text-2xl font-mono font-black text-white">${p.priceUSD} USD</span>
                        <span className="text-xs text-slate-400"> {p.period}</span>
                      </div>
                      <div className="mb-3 text-xs font-mono font-semibold text-fuchsia-400">
                        ≈ ${p.priceCOP} COP
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {p.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <span className={`block text-center text-xs font-bold py-1.5 rounded-lg transition ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'
                      }`}>
                        {isSelected ? 'Plan Seleccionado' : 'Elegir Plan'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cupón */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">¿Tienes un cupón de descuento?</span>
                <span className="text-[10px] text-slate-500 font-mono">(Prueba: PROMO50 o VIPFREE)</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Código de cupón"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white uppercase focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-bold"
                >
                  Aplicar
                </button>
              </div>
            </div>

            {appliedCoupon && (
              <div className="mb-4 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Cupón aplicado: {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF) &bull; Total: ${finalPriceUSD} USD (${finalPriceCOP} COP)
              </div>
            )}
            {couponError && (
              <div className="mb-4 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {couponError}
              </div>
            )}

            {/* Barra de Proceder a Pagar con Nequi o PayPal */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">Total a pagar:</span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-white">${finalPriceUSD} USD</span>
                  <span className="text-base font-black font-mono text-fuchsia-400">(${finalPriceCOP} COP)</span>
                  <span className="text-xs text-emerald-400 font-bold uppercase">({selectedPlan})</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('nequi')}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-fuchsia-500/20 flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pagar con Nequi Colombia</span>
                </button>

                <button
                  onClick={() => setActiveTab('paypal')}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Pagar con PayPal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: PAGO EXCLUSIVO CON NEQUI COLOMBIA */}
        {activeTab === 'nequi' && (
          <div className="bg-slate-950/80 border border-fuchsia-500/30 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-fuchsia-600/30">
                  N
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Transferencia Directa Nequi Colombia
                  </h3>
                  <p className="text-xs text-slate-400">Paga en segundos desde tu aplicación Nequi en pesos colombianos.</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 block">Total a transferir en COP:</span>
                <span className="text-2xl font-mono font-black text-fuchsia-400 block">${finalPriceCOP} COP</span>
                <span className="text-[10px] text-slate-500">Plan: {currentPlan.name}</span>
              </div>
            </div>

            {/* Datos de la cuenta Nequi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
              {/* Tarjeta Visual de Nequi Oficial */}
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1f0033] to-[#390059] border border-fuchsia-500/40 rounded-2xl shadow-lg w-full h-full text-center">
                <div className="w-10 h-10 rounded-xl bg-[#ff0077] flex items-center justify-center text-white font-black text-lg mb-2 shadow-md shadow-[#ff0077]/40">
                  N
                </div>
                <span className="text-xs font-black tracking-wider text-fuchsia-300 uppercase">Nequi Colombia</span>
                <span className="text-[11px] text-white/80 font-medium mt-1">Transferencia Directa</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full mt-2 border border-emerald-500/30">
                  ● Acreditación Inmediata
                </span>
              </div>

              {/* Información y botón copiar */}
              <div className="md:col-span-2 space-y-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Número de Celular Nequi:</span>
                      <span className="text-xl font-mono font-black text-fuchsia-400 tracking-wider">{nequiPhone}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(nequiPhone.replace(/\s+/g, ''))}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-black shadow-md shadow-fuchsia-600/30 transition active:scale-95"
                    >
                      {copiedText ? <CheckCheck className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedText ? '¡Copiado!' : 'Copiar Celular'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Titular de la cuenta:</span>
                    <strong className="text-white font-semibold">{nequiName}</strong>
                  </div>
                </div>

                {/* Pasos rápidos */}
                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="text-slate-300 font-bold flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-fuchsia-400" /> Pasos para enviar:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10.5px]">
                    <li>Abre tu app Nequi y toca <strong className="text-white">"Envía plata" &gt; "A Celular"</strong>.</li>
                    <li>Escribe el número <strong className="text-fuchsia-300">{nequiPhone}</strong>.</li>
                    <li>Transfiere <strong className="text-white">${finalPriceCOP} COP</strong>.</li>
                  </ol>
                </div>

                {/* Input de comprobante */}
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                    Ingresa el Número de Aprobación o Referencia de tu comprobante Nequi:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: M1892049 o M9821032"
                    value={nequiApprovalCode}
                    onChange={(e) => setNequiApprovalCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-fuchsia-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Aparece en la pantalla final de comprobante en tu app Nequi tras enviar.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveTab('planes')}
                className="text-xs text-slate-400 hover:text-white"
              >
                &larr; Volver a seleccionar plan
              </button>

              <button
                onClick={() => {
                  if (!nequiApprovalCode || nequiApprovalCode.length < 3) {
                    alert('Por favor escribe el número de aprobación o referencia de tu pago Nequi.');
                    return;
                  }
                  handleExecutePayment('nequi', { approvalCode: nequiApprovalCode, nequiPhone });
                }}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-black text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? 'Verificando con Nequi...' : 'Confirmar Pago Nequi & Activar'}
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: PAGO EXCLUSIVO CON PAYPAL */}
        {activeTab === 'paypal' && (
          <div className="bg-slate-950/80 border border-sky-500/30 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-sky-600/30">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Pago Internacional con PayPal
                  </h3>
                  <p className="text-xs text-slate-400">Paga escaneando el código QR oficial de PayPal o mediante enlace directo.</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 block">Total a pagar:</span>
                <span className="text-2xl font-mono font-black text-sky-400 block">${finalPriceUSD} USD</span>
                <span className="text-[10px] text-slate-500">Plan: {currentPlan.name}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
              {/* Código QR Real de PayPal subido por el usuario */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-2xl shadow-xl border-2 border-sky-500/40 w-48 shrink-0">
                  <img
                    src="/paypal-qr.jpg"
                    alt="Código QR Oficial PayPal - Abel Pacheco Santacruz"
                    className="w-full h-auto rounded-xl object-contain"
                  />
                  <span className="text-[10px] text-slate-900 font-bold mt-1 text-center">
                    Abel Pacheco Santacruz
                  </span>
                </div>

                <div className="space-y-3 w-full">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Correo oficial de cobro PayPal:</span>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                      <span className="text-xs sm:text-sm font-mono font-bold text-sky-300 break-all">{paypalEmail}</span>
                      <button
                        onClick={() => handleCopy(paypalEmail)}
                        className="text-xs text-sky-400 hover:text-white flex items-center gap-1 font-bold ml-2 shrink-0"
                      >
                        {copiedText ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copiar</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">Titular: <strong className="text-slate-200">Abel Pacheco Santacruz</strong></span>
                  </div>

                  <div className="pt-1">
                    <a
                      href={`https://www.paypal.com/paypalme/abelpachecosantacruz/${finalPriceUSD}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition"
                    >
                      <span>Abrir PayPal para Enviar ${finalPriceUSD} USD</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                  Ingresa el ID de Transacción o correo de tu cuenta de PayPal tras pagar:
                </label>
                <input
                  type="text"
                  placeholder="Ej: 9AB12345CD67890 o tu correo de PayPal"
                  value={paypalTxId}
                  onChange={(e) => setPaypalTxId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Se encuentra en el recibo de compra emitido por PayPal.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveTab('planes')}
                className="text-xs text-slate-400 hover:text-white"
              >
                &larr; Volver a seleccionar plan
              </button>

              <button
                onClick={() => {
                  if (!paypalTxId || paypalTxId.length < 3) {
                    alert('Por favor ingresa el ID de transacción o correo de PayPal.');
                    return;
                  }
                  handleExecutePayment('paypal', { paypalTxId, paypalEmail });
                }}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? 'Verificando con PayPal...' : 'Confirmar Pago PayPal & Activar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CONFIGURACIÓN: PARA QUE JOSUÉ INGRESE SU NÚMERO DE NEQUI Y PAYPAL REALES */}
      {showConfigModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Configurar Cuentas de Cobro
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Aquí puedes ingresar tu número de celular Nequi real y tu cuenta de PayPal para que todos los clientes te transfieran directamente a ti.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-fuchsia-400 font-bold block mb-1">Tu Celular Nequi Colombia:</label>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="Ej: 312 456 7890"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Nombre del Titular Nequi:</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ej: Josué TuApellido"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="text-sky-400 font-bold block mb-1">Tu Correo de PayPal:</label>
                <input
                  type="text"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="Ej: micorreo@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Tu Enlace PayPal.me (Opcional):</label>
                <input
                  type="text"
                  value={tempPaypalMe}
                  onChange={(e) => setTempPaypalMe(e.target.value)}
                  placeholder="Ej: https://paypal.me/tuusuario"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePaymentConfig}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg"
              >
                Guardar Mis Datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
