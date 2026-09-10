import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_data.json');

// Configuración de Cuentas de Cobro Exclusivas (Nequi Colombia y PayPal)
export const PAYMENT_CONFIG = {
  nequi: {
    phone: '312 620 2703',
    accountName: 'Abel Pacheco Santacruz',
    accountType: 'Nequi Colombia',
    exchangeRateCop: 4000 // 1 USD = 4.000 COP
  },
  paypal: {
    email: 'abelsantiagosantacruz67@gmail.com',
    accountName: 'Abel Pacheco Santacruz',
    paypalMe: 'https://paypal.me/abelpachecosantacruz',
    qrImage: '/paypal-qr.jpg'
  }
};

// 2 dias en milisegundos (48 horas exactas)
const TRIAL_DURATION_MS = 2 * 24 * 60 * 60 * 1000;

class Database {
  constructor() {
    this.users = [];
    this.signalsHistory = [];
    this.payments = [];
    this.coupons = {
      'PROMO50': { discountPercent: 50, description: '50% de descuento de bienvenida', uses: 12 },
      'LAUNCH20': { discountPercent: 20, description: '20% de descuento por lanzamiento', uses: 8 },
      'VIPFREE': { discountPercent: 100, freeDays: 30, description: 'Pase VIP Gratuito por 30 Días', uses: 3 }
    };
    this.adminPin = 'AbelMaster#2026';
    this.load();
    this.ensureDefaultUser();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        this.users = data.users || [];
        this.signalsHistory = data.signalsHistory || [];
        this.payments = data.payments || [];
        if (data.adminPin) this.adminPin = data.adminPin;
        if (data.coupons) this.coupons = { ...this.coupons, ...data.coupons };
        if (data.paymentConfig) {
          if (data.paymentConfig.nequi) Object.assign(PAYMENT_CONFIG.nequi, data.paymentConfig.nequi);
          if (data.paymentConfig.paypal) Object.assign(PAYMENT_CONFIG.paypal, data.paymentConfig.paypal);
        }
      }
    } catch (err) {
      console.warn('Error reading db_data.json, starting fresh', err);
      this.users = [];
      this.signalsHistory = [];
      this.payments = [];
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify({
        users: this.users,
        signalsHistory: this.signalsHistory,
        payments: this.payments,
        coupons: this.coupons,
        paymentConfig: PAYMENT_CONFIG,
        adminPin: this.adminPin
      }, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db_data.json', err);
    }
  }

  ensureDefaultUser() {
    const defaultEmail = 'demo@trader.ai';
    let user = this.users.find(u => u.email === defaultEmail);
    if (!user) {
      const now = Date.now();
      user = {
        id: 'user_demo_001',
        name: 'Trader VIP Demo',
        email: defaultEmail,
        password: 'password123',
        createdAt: now,
        // Prueba gratuita de 2 dias a partir de ahora
        trialEndsAt: now + TRIAL_DURATION_MS,
        isSubscribed: false,
        subscriptionPlan: null,
        subscriptionExpiresAt: null,
        forcedExpired: false // para permitir al usuario probar el paywall
      };
      this.users.push(user);
      this.save();
    }
  }

  getUser(id) {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser({ name, email, password }) {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('El correo electronico ya esta registrado.');
    }
    const now = Date.now();
    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name || 'Trader',
      email: email.toLowerCase(),
      password,
      createdAt: now,
      trialEndsAt: now + TRIAL_DURATION_MS,
      isSubscribed: false,
      subscriptionPlan: null,
      subscriptionExpiresAt: null,
      forcedExpired: false
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  getTrialStatus(userId) {
    const user = this.getUser(userId);
    if (!user) {
      return { isValid: false, reason: 'Usuario no encontrado' };
    }

    const now = Date.now();
    const isSubscribed = user.isSubscribed && (!user.subscriptionExpiresAt || user.subscriptionExpiresAt > now);
    
    // Si se forzo la expiracion para pruebas
    if (user.forcedExpired && !isSubscribed) {
      return {
        userId: user.id,
        isTrialActive: false,
        isSubscribed: false,
        requiresPaywall: true,
        daysLeft: 0,
        hoursLeft: 0,
        minutesLeft: 0,
        secondsLeft: 0,
        totalSecondsLeft: 0,
        trialEndsAt: user.trialEndsAt,
        message: 'Tu prueba gratuita de 2 dias ha expirado. Adquiere un plan para continuar accediendo a las senales.'
      };
    }

    if (isSubscribed) {
      return {
        userId: user.id,
        isTrialActive: false,
        isSubscribed: true,
        requiresPaywall: false,
        subscriptionPlan: user.subscriptionPlan,
        expiresAt: user.subscriptionExpiresAt,
        message: 'Suscripcion Activa (' + user.subscriptionPlan + ')'
      };
    }

    const msRemaining = user.trialEndsAt - now;
    if (msRemaining <= 0) {
      return {
        userId: user.id,
        isTrialActive: false,
        isSubscribed: false,
        requiresPaywall: true,
        daysLeft: 0,
        hoursLeft: 0,
        minutesLeft: 0,
        secondsLeft: 0,
        totalSecondsLeft: 0,
        trialEndsAt: user.trialEndsAt,
        message: 'Tu prueba gratuita de 2 dias ha expirado.'
      };
    }

    const totalSecondsLeft = Math.floor(msRemaining / 1000);
    const daysLeft = Math.floor(totalSecondsLeft / (3600 * 24));
    const hoursLeft = Math.floor((totalSecondsLeft % (3600 * 24)) / 3600);
    const minutesLeft = Math.floor((totalSecondsLeft % 3600) / 60);
    const secondsLeft = totalSecondsLeft % 60;

    return {
      userId: user.id,
      isTrialActive: true,
      isSubscribed: false,
      requiresPaywall: false,
      daysLeft,
      hoursLeft,
      minutesLeft,
      secondsLeft,
      totalSecondsLeft,
      trialEndsAt: user.trialEndsAt,
      message: `Prueba gratuita activa: te quedan ${daysLeft}d ${hoursLeft}h ${minutesLeft}m`
    };
  }

  upgradeSubscription(userId, plan) {
    const user = this.getUser(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const durationDays = plan === 'anual' ? 365 
      : plan === 'trimestral' ? 90 
      : plan === 'pase_24h' ? 1 
      : 30;
      
    const now = Date.now();

    user.isSubscribed = true;
    user.subscriptionPlan = plan.toUpperCase();
    user.subscriptionExpiresAt = now + (durationDays * 24 * 60 * 60 * 1000);
    user.forcedExpired = false;
    this.save();
    return user;
  }

  validateCoupon(code) {
    if (!code) return { valid: false, message: 'Código no especificado' };
    const clean = code.trim().toUpperCase();
    if (this.coupons[clean]) {
      return { valid: true, code: clean, ...this.coupons[clean] };
    }
    return { valid: false, message: 'Cupón inválido o expirado' };
  }

  processCheckout(userId, { plan = 'mensual', method = 'card', paymentDetails = {}, couponCode = null }) {
    const user = this.getUser(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const prices = {
      pase_24h: 7,
      mensual: 29,
      trimestral: 69,
      anual: 199
    };

    let baseAmount = prices[plan] || 29;
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const couponCheck = this.validateCoupon(couponCode);
      if (couponCheck.valid) {
        appliedCoupon = couponCheck.code;
        discount = (baseAmount * couponCheck.discountPercent) / 100;
      }
    }

    const finalAmount = Math.max(0, Number((baseAmount - discount).toFixed(2)));

    // Actualizar usuario
    this.upgradeSubscription(userId, plan);

    // Registrar pago
    const paymentRecord = {
      id: 'pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      userEmail: user.email,
      plan: plan.toUpperCase(),
      method, // 'nequi', 'paypal', 'coupon'
      baseAmount,
      discount,
      finalAmount,
      currency: method === 'nequi' ? 'COP' : 'USD',
      appliedCoupon,
      status: 'CONFIRMED',
      timestamp: Date.now(),
      details: paymentDetails
    };

    this.payments.unshift(paymentRecord);
    this.save();

    return {
      success: true,
      payment: paymentRecord,
      user: { id: user.id, name: user.name, email: user.email },
      trialStatus: this.getTrialStatus(userId)
    };
  }

  activateBrokerSponsorship(userId, { brokerName, accountId }) {
    const user = this.getUser(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!accountId || accountId.length < 4) {
      throw new Error('Debes ingresar un ID o número de cuenta de trading válido.');
    }

    // Otorga 30 días de acceso Pro gratuito gracias al broker asociado
    const now = Date.now();
    user.isSubscribed = true;
    user.subscriptionPlan = `BROKER_${brokerName.toUpperCase()}_PRO`;
    user.subscriptionExpiresAt = now + (30 * 24 * 60 * 60 * 1000);
    user.forcedExpired = false;

    const sponsorRecord = {
      id: 'spn_' + Date.now(),
      userId,
      brokerName,
      accountId,
      grantedDays: 30,
      timestamp: now,
      status: 'VERIFIED_SPONSORED'
    };

    this.payments.unshift({
      id: 'pay_spn_' + Date.now(),
      userId,
      plan: 'BROKER_CPA_30D',
      method: 'broker_cpa',
      finalAmount: 0,
      currency: 'USD',
      status: 'CONFIRMED_BROKER',
      timestamp: now,
      details: { brokerName, accountId }
    });

    this.save();
    return {
      success: true,
      message: `¡Cuenta ${accountId} verificada con ${brokerName}! Has desbloqueado 30 días Pro GRATIS.`,
      user: { id: user.id, name: user.name },
      trialStatus: this.getTrialStatus(userId)
    };
  }

  resetTrial(userId) {
    const user = this.getUser(userId);
    if (!user) throw new Error('Usuario no encontrado');
    const now = Date.now();
    user.isSubscribed = false;
    user.subscriptionPlan = null;
    user.subscriptionExpiresAt = null;
    user.forcedExpired = false;
    user.trialEndsAt = now + TRIAL_DURATION_MS;
    this.save();
    return this.getTrialStatus(userId);
  }

  toggleForceExpireTrial(userId, forceExpire) {
    const user = this.getUser(userId);
    if (!user) throw new Error('Usuario no encontrado');
    user.forcedExpired = forceExpire;
    if (!forceExpire) {
      user.trialEndsAt = Date.now() + TRIAL_DURATION_MS;
      user.isSubscribed = false;
    }
    this.save();
    return this.getTrialStatus(userId);
  }

  logSignal(signal) {
    this.signalsHistory.unshift({
      id: 'sig_' + Date.now(),
      timestamp: Date.now(),
      ...signal
    });
    if (this.signalsHistory.length > 100) {
      this.signalsHistory.pop();
    }
    this.save();
  }

  getSignals(limit = 20) {
    return this.signalsHistory.slice(0, limit);
  }

  // MÉTODOS EXCLUSIVOS PARA EL DUEÑO DE LA WEB (ADMIN)
  verifyAdminPin(pin) {
    return String(pin).trim() === String(this.adminPin).trim();
  }

  changeAdminPassword(newPassword) {
    if (!newPassword || newPassword.trim().length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    this.adminPin = String(newPassword).trim();
    this.save();
    return true;
  }

  getAdminMetrics() {
    const now = Date.now();
    let totalCOP = 0;
    let totalUSD = 0;
    let nequiCount = 0;
    let paypalCount = 0;

    this.payments.forEach(p => {
      const amt = Number(p.finalAmount) || 0;
      if (p.currency === 'COP') {
        totalCOP += amt;
        nequiCount++;
      } else {
        totalUSD += amt;
        if (p.method === 'paypal') paypalCount++;
      }
    });

    const activeSubscribers = this.users.filter(u => u.isSubscribed && (!u.subscriptionExpiresAt || u.subscriptionExpiresAt > now)).length;
    const activeTrialUsers = this.users.filter(u => !u.isSubscribed && u.trialEndsAt > now && !u.forcedExpired).length;
    const expiredTrialUsers = this.users.filter(u => !u.isSubscribed && (u.trialEndsAt <= now || u.forcedExpired)).length;

    return {
      totalUsers: this.users.length,
      activeTrialUsers,
      expiredTrialUsers,
      activeSubscribers,
      totalPaymentsCount: this.payments.length,
      totalRevenueCOP: totalCOP,
      totalRevenueUSD: totalUSD,
      paymentsByMethod: {
        nequi: nequiCount,
        paypal: paypalCount,
        other: this.payments.length - (nequiCount + paypalCount)
      },
      paymentConfig: PAYMENT_CONFIG,
      recentSignalsCount: this.signalsHistory.length
    };
  }

  getAllPayments() {
    return this.payments;
  }

  confirmPayment(paymentId) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Pago no encontrado');
    payment.status = 'CONFIRMED';
    // Asegurar suscripción de usuario
    if (payment.userId) {
      this.upgradeSubscription(payment.userId, (payment.plan || 'mensual').toLowerCase());
    }
    this.save();
    return payment;
  }

  getCoupons() {
    return Object.entries(this.coupons).map(([code, details]) => ({
      code,
      ...details
    }));
  }

  createCoupon({ code, discountPercent, description }) {
    if (!code) throw new Error('El código es obligatorio');
    const cleanCode = code.trim().toUpperCase();
    this.coupons[cleanCode] = {
      discountPercent: Number(discountPercent) || 10,
      description: description || `Descuento especial de ${discountPercent}%`,
      uses: 0
    };
    this.save();
    return { code: cleanCode, ...this.coupons[cleanCode] };
  }
}

export const db = new Database();
