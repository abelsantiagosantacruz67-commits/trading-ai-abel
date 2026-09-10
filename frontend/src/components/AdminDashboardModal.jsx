import React, { useState, useEffect } from 'react';
import { 
  Crown, X, Lock, DollarSign, Users, ShieldCheck, 
  CheckCircle2, RefreshCw, KeyRound, ArrowRight,
  TrendingUp, Tag, Smartphone, PlusCircle
} from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState('metricas'); // 'metricas', 'pagos', 'cuentas', 'cupones'
  
  // Data states
  const [metrics, setMetrics] = useState(null);
  const [payments, setPayments] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(25);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const [editNequiPhone, setEditNequiPhone] = useState('312 620 2703');
  const [editNequiName, setEditNequiName] = useState('Abel Pacheco Santacruz');
  const [editPaypalEmail, setEditPaypalEmail] = useState('abelsantiagosantacruz67@gmail.com');
  const [editPaypalMe, setEditPaypalMe] = useState('https://paypal.me/abelpachecosantacruz');
  const [adminNewPass, setAdminNewPass] = useState('');

  // Login handler
  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllAdminData();
      } else {
        setAuthError(data.message || 'Contraseña incorrecta');
      }
    } catch (err) {
      setAuthError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!adminNewPass || adminNewPass.trim().length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: adminNewPass })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('¡Contraseña de Administrador actualizada exitosamente!');
        setAdminNewPass('');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert(data.message || 'Error al actualizar contraseña');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes, cRes, cfgRes] = await Promise.all([
        fetch('/api/admin/metrics').then(r => r.json()),
        fetch('/api/admin/payments').then(r => r.json()),
        fetch('/api/admin/coupons').then(r => r.json()),
        fetch('/api/payment-config').then(r => r.json())
      ]);

      if (mRes.success) setMetrics(mRes.metrics);
      if (pRes.success) setPayments(pRes.payments || []);
      if (cRes.success) setCoupons(cRes.coupons || []);
      if (cfgRes.success && cfgRes.config) {
        setConfig(cfgRes.config);
        setEditNequiPhone(cfgRes.config.nequi?.phone || '312 620 2703');
        setEditNequiName(cfgRes.config.nequi?.accountName || 'Abel Pacheco Santacruz');
        setEditPaypalEmail(cfgRes.config.paypal?.email || 'abelsantiagosantacruz67@gmail.com');
        setEditPaypalMe(cfgRes.config.paypal?.paypalMe || 'https://paypal.me/abelpachecosantacruz');
      }
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/confirm`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('¡Pago confirmado y membresía Pro activada con éxito!');
        setTimeout(() => setSuccessMsg(null), 4000);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error al confirmar pago');
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nequiPhone: editNequiPhone,
          nequiName: editNequiName,
          paypalEmail: editPaypalEmail,
          paypalMe: editPaypalMe
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Cuentas de cobro actualizadas exitosamente en toda la plataforma.');
        setTimeout(() => setSuccessMsg(null), 4000);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error al actualizar configuración');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discountPercent: newCouponDiscount,
          description: newCouponDesc || `Descuento especial de ${newCouponDiscount}%`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setNewCouponCode('');
        setNewCouponDesc('');
        setTimeout(() => setSuccessMsg(null), 4000);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error al crear cupón');
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-500/10 text-white my-8 max-h-[92vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Panel de Control del Dueño</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PROPIETARIO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Titular Oficial: <strong className="text-amber-300">Abel Pacheco Santacruz</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={loadAllAdminData}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1"
                title="Actualizar Datos"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Refrescar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ALERTA DE ÉXITO */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PANTALLA DE ACCESO POR PIN (SI NO ESTÁ AUTENTICADO) */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-2">Acceso Exclusivo de Administrador</h3>
            <p className="text-xs text-slate-400 max-w-md mb-6">
              Para ver los pagos recibidos en Nequi y PayPal, métricas de clientes y editar tus cuentas, ingresa tu contraseña de seguridad:
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  placeholder="Contraseña de Administrador"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-center font-mono text-sm tracking-normal text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded-lg border border-rose-500/30">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !pin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <span>{loading ? 'Verificando...' : 'Entrar al Panel de Control'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* CONTENIDO PRINCIPAL DEL DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden pt-4 space-y-4">
            {/* PESTAÑAS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('metricas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'metricas'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Métricas de Negocio</span>
              </button>

              <button
                onClick={() => setActiveTab('pagos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'pagos'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Bandeja de Pagos ({payments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('cuentas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'cuentas'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Cuentas de Cobro</span>
              </button>

              <button
                onClick={() => setActiveTab('cupones')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'cupones'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Cupones de Descuento ({coupons.length})</span>
              </button>
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              
              {/* TAB 1: MÉTRICAS */}
              {activeTab === 'metricas' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Tarjeta 1: Recaudado en COP */}
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-fuchsia-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Recaudado Nequi</span>
                        <span className="w-6 h-6 rounded-lg bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center font-black">N</span>
                      </div>
                      <span className="text-2xl font-mono font-black text-fuchsia-400 block">
                        ${(metrics?.totalRevenueCOP || 0).toLocaleString()} COP
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {metrics?.paymentsByMethod?.nequi || 0} transferencias recibidas
                      </span>
                    </div>

                    {/* Tarjeta 2: Recaudado en USD */}
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-sky-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Recaudado PayPal</span>
                        <span className="w-6 h-6 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center font-black">P</span>
                      </div>
                      <span className="text-2xl font-mono font-black text-sky-400 block">
                        ${(metrics?.totalRevenueUSD || 0).toFixed(2)} USD
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {metrics?.paymentsByMethod?.paypal || 0} transacciones recibidas
                      </span>
                    </div>

                    {/* Tarjeta 3: Usuarios Totales */}
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Usuarios Registrados</span>
                        <Users className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-2xl font-mono font-black text-white block">
                        {metrics?.totalUsers || 0}
                      </span>
                      <span className="text-[10px] text-emerald-400 block">
                        ● {metrics?.activeTrialUsers || 0} en prueba activa de 2 días
                      </span>
                    </div>

                    {/* Tarjeta 4: Suscriptores Activos */}
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Suscriptores Activos</span>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-2xl font-mono font-black text-amber-300 block">
                        {metrics?.activeSubscribers || 0}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Acceso Pro sin paywall
                      </span>
                    </div>
                  </div>

                  {/* Banner de Estado General */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        Motor de Análisis Cuantitativo en Vivo
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Monitoreando activamente 12 mercados financieros (Blips, Digitales, Forex CFD, Crypto, Acciones, Materias Primas, Bonos).
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-slate-500 block">Señales emitidas:</span>
                      <span className="text-lg font-mono font-bold text-cyan-400">{metrics?.recentSignalsCount || 76}+</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BANDEJA DE PAGOS */}
              {activeTab === 'pagos' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Lista de todas las compras y comprobantes enviados por usuarios:</span>
                    <span>Total: {payments.length} transacciones</span>
                  </div>

                  {payments.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400">Aún no hay transacciones registradas.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3">ID / Fecha</th>
                            <th className="p-3">Usuario</th>
                            <th className="p-3">Plan</th>
                            <th className="p-3">Método</th>
                            <th className="p-3">Monto</th>
                            <th className="p-3">Comprobante / Ref</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {payments.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-900/40 transition">
                              <td className="p-3 text-[11px]">
                                <span className="text-slate-300 font-bold block">{p.id}</span>
                                <span className="text-slate-500 text-[9px]">{new Date(p.timestamp).toLocaleString()}</span>
                              </td>
                              <td className="p-3 font-sans">
                                <span className="text-white block font-medium">{p.userEmail || p.userId}</span>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  {p.plan}
                                </span>
                              </td>
                              <td className="p-3 font-sans">
                                {p.method === 'nequi' ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30">
                                    Nequi
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-sky-600/20 text-sky-300 border border-sky-500/30">
                                    PayPal
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-bold text-emerald-400">
                                {p.currency === 'COP' ? `$${p.finalAmount} COP` : `$${p.finalAmount} USD`}
                              </td>
                              <td className="p-3 text-[11px] text-slate-300 font-mono">
                                {p.details?.approvalCode || p.details?.transactionId || p.details?.paypalTxId || 'Directo'}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  p.status === 'CONFIRMED' 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {p.status !== 'CONFIRMED' ? (
                                  <button
                                    onClick={() => handleConfirmPayment(p.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] shadow"
                                  >
                                    Aprobar
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-sans">Activo</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CUENTAS DE COBRO */}
              {activeTab === 'cuentas' && (
                <div className="space-y-4">
                  <form onSubmit={handleSaveConfig} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Editar Cuentas Oficiales de Cobro</h4>
                      <p className="text-xs text-slate-400">
                        Modifica tu número de celular de Nequi o tu correo de PayPal. Los cambios se reflejarán inmediatamente en la web para todos los visitantes.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-fuchsia-400 font-bold block">Celular Nequi Colombia:</label>
                        <input
                          type="text"
                          value={editNequiPhone}
                          onChange={(e) => setEditNequiPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-fuchsia-500"
                          placeholder="Ej: 312 620 2703"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-fuchsia-400 font-bold block">Titular de Nequi:</label>
                        <input
                          type="text"
                          value={editNequiName}
                          onChange={(e) => setEditNequiName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-fuchsia-500"
                          placeholder="Abel Pacheco Santacruz"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sky-400 font-bold block">Correo de PayPal:</label>
                        <input
                          type="email"
                          value={editPaypalEmail}
                          onChange={(e) => setEditPaypalEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                          placeholder="abelsantiagosantacruz67@gmail.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sky-400 font-bold block">Enlace de Pago PayPal.Me:</label>
                        <input
                          type="text"
                          value={editPaypalMe}
                          onChange={(e) => setEditPaypalMe(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                          placeholder="https://paypal.me/abelpachecosantacruz"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Guardar Cuentas de Cobro</span>
                      </button>
                    </div>
                  </form>

                  {/* CAMBIO DE CONTRASEÑA MAESTRA */}
                  <form onSubmit={handleChangePassword} className="bg-slate-950 p-5 rounded-2xl border border-amber-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Cambiar Contraseña de Administrador</h4>
                        <p className="text-xs text-slate-400">
                          Establece una nueva clave para proteger el acceso a este panel de control.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <input
                        type="password"
                        value={adminNewPass}
                        onChange={(e) => setAdminNewPass(e.target.value)}
                        placeholder="Nueva contraseña (mínimo 6 caracteres)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Actualizar Contraseña</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: CUPONES */}
              {activeTab === 'cupones' && (
                <div className="space-y-4">
                  {/* Crear Cupón */}
                  <form onSubmit={handleCreateCoupon} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-amber-400" />
                      Crear Nuevo Cupón de Descuento
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Código del Cupón:</label>
                        <input
                          type="text"
                          placeholder="Ej: LANZAMIENTO40"
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500 uppercase"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">% de Descuento:</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={newCouponDiscount}
                          onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Descripción / Motivo:</label>
                        <input
                          type="text"
                          placeholder="Ej: Descuento para comunidad Telegram"
                          value={newCouponDesc}
                          onChange={(e) => setNewCouponDesc(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newCouponCode}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow disabled:opacity-50"
                      >
                        <span>Crear Cupón</span>
                      </button>
                    </div>
                  </form>

                  {/* Lista de Cupones */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {coupons.map((c) => (
                      <div key={c.code} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-black text-amber-400 tracking-wider">{c.code}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                            {c.discountPercent}% OFF
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{c.description}</p>
                        <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-800/60">
                          Usos registrados: <strong className="text-slate-300">{c.uses || 0}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
