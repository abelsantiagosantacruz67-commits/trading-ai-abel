import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MARKETS_METADATA, marketData } from './marketData.js';
import { analyzeMarketWithAI, AI_STRATEGIES } from './aiEngine.js';
import { db, PAYMENT_CONFIG } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Helper para extraer o simular el ID de usuario activo
const getRequestUserId = (req) => {
  return req.headers['x-user-id'] || 'user_demo_001';
};

// 1. Obtener lista de mercados y activos
app.get('/api/markets', (req, res) => {
  res.json({
    success: true,
    markets: MARKETS_METADATA
  });
});

// 1b. Obtener estrategias de IA disponibles
app.get('/api/ai/strategies', (req, res) => {
  res.json({
    success: true,
    strategies: AI_STRATEGIES
  });
});

// 2. Obtener datos de velas y precio actual de un activo
app.get('/api/market/:symbol/candles', (req, res) => {
  const { symbol } = req.params;
  const assetMeta = marketData.getAssetMetadata(symbol);
  if (!assetMeta) {
    return res.status(404).json({ success: false, message: 'Activo no encontrado' });
  }

  const candles = marketData.getCandles(symbol);
  const currentPrice = marketData.getCurrentPrice(symbol);

  res.json({
    success: true,
    symbol,
    name: assetMeta.name,
    marketType: assetMeta.marketKey,
    currentPrice,
    decimals: assetMeta.decimals,
    candles,
    isRealFeed: true,
    feedSource: assetMeta.feedSource || 'Mercado Mundial Real',
    realStats: assetMeta.realStats || null,
    realExchange: assetMeta.mapping?.exchange || 'GLOBAL'
  });
});

// 3. API Principal de IA: Predicción y Probabilidades (Subida vs Bajada) con Selección de Estrategia
app.get('/api/ai/predict/:symbol', (req, res) => {
  const { symbol } = req.params;
  const strategy = req.query.strategy || 'daytrading';
  const userId = getRequestUserId(req);

  // Verificar estado del periodo de prueba (2 días) o suscripción
  const trialStatus = db.getTrialStatus(userId);
  if (trialStatus.requiresPaywall) {
    return res.status(403).json({
      success: false,
      requiresPaywall: true,
      trialStatus,
      message: 'Tu prueba gratuita de 2 días ha expirado. Por favor suscríbete para desbloquear las probabilidades de la IA en tiempo real.'
    });
  }

  const assetMeta = marketData.getAssetMetadata(symbol);
  if (!assetMeta) {
    return res.status(404).json({ success: false, message: 'Activo no encontrado' });
  }

  const candles = marketData.getCandles(symbol);
  const currentPrice = marketData.getCurrentPrice(symbol);

  const prediction = analyzeMarketWithAI({
    marketType: assetMeta.marketKey,
    symbol: assetMeta.symbol,
    name: assetMeta.name,
    candles,
    currentPrice,
    strategy
  });

  // Registrar señal en el historial
  db.logSignal({
    symbol: prediction.symbol,
    name: prediction.name,
    marketType: prediction.marketType,
    recommendation: prediction.recommendation,
    probUp: prediction.probabilityUp,
    probDown: prediction.probabilityDown,
    price: currentPrice,
    confidence: prediction.confidence,
    historicalWinRate: prediction.estimatedHistoricalWinRate
  });

  res.json({
    success: true,
    trialStatus,
    prediction
  });
});

// 4. Estado del Periodo de Prueba y Usuario
app.get('/api/user/status', (req, res) => {
  const userId = getRequestUserId(req);
  const user = db.getUser(userId);
  const status = db.getTrialStatus(userId);

  res.json({
    success: true,
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    status
  });
});

// 5. Interruptor de prueba para simular expiración de los 2 días (Testing de Paywall)
app.post('/api/user/toggle-trial-expired', (req, res) => {
  const userId = getRequestUserId(req);
  const { forceExpire } = req.body;
  try {
    const updatedStatus = db.toggleForceExpireTrial(userId, forceExpire);
    res.json({
      success: true,
      status: updatedStatus
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5b. Restaurar prueba gratuita original de 2 días
app.post('/api/user/reset-trial', (req, res) => {
  const userId = getRequestUserId(req);
  try {
    const updatedStatus = db.resetTrial(userId);
    res.json({
      success: true,
      status: updatedStatus
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 6. Registro de nuevo usuario (otorga 2 días exactos de prueba)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = db.createUser({ name, email, password });
    const status = db.getTrialStatus(newUser.id);
    res.json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      trialStatus: status
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 7. Login de usuario
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
  const status = db.getTrialStatus(user.id);
  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
    trialStatus: status
  });
});

// 8. Suscripción y Checkout Multicanal (Crypto, Tarjeta, PayPal, Cupones)
app.post('/api/subscription/upgrade', (req, res) => {
  const userId = getRequestUserId(req);
  const { plan } = req.body;
  try {
    const user = db.upgradeSubscription(userId, plan);
    const status = db.getTrialStatus(userId);
    res.json({
      success: true,
      message: `¡Felicidades! Has activado el plan ${plan.toUpperCase()} con acceso total e ilimitado.`,
      user: { id: user.id, name: user.name, email: user.email },
      status
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 8b. Checkout Completo con Pasarelas (Crypto USDT, Stripe/Card, PayPal)
app.post('/api/subscription/checkout', (req, res) => {
  const userId = getRequestUserId(req);
  const { plan, method, paymentDetails, couponCode } = req.body;
  try {
    const result = db.processCheckout(userId, { plan, method, paymentDetails, couponCode });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 8c. Validar Código de Cupón o Descuento
app.post('/api/coupons/validate', (req, res) => {
  const { code } = req.body;
  const result = db.validateCoupon(code);
  res.json(result);
});

// 8d. Activación Patrocinada por Broker Asociado (CPA / Afiliado 30 Días Pro Gratis)
app.post('/api/broker/activate', (req, res) => {
  const userId = getRequestUserId(req);
  const { brokerName, accountId } = req.body;
  try {
    const result = db.activateBrokerSponsorship(userId, { brokerName, accountId });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 8e. Consultar Cuentas de Cobro Exclusivas (Nequi Colombia & PayPal)
app.get('/api/payment-config', (req, res) => {
  res.json({
    success: true,
    config: PAYMENT_CONFIG
  });
});

// 8f. Actualizar Datos de Nequi o PayPal
app.post('/api/payment-config', (req, res) => {
  const { nequiPhone, nequiName, paypalEmail, paypalMe } = req.body;
  if (nequiPhone) PAYMENT_CONFIG.nequi.phone = nequiPhone;
  if (nequiName) PAYMENT_CONFIG.nequi.accountName = nequiName;
  if (paypalEmail) PAYMENT_CONFIG.paypal.email = paypalEmail;
  if (paypalMe) PAYMENT_CONFIG.paypal.paypalMe = paypalMe;
  res.json({
    success: true,
    message: 'Cuentas de cobro actualizadas correctamente.',
    config: PAYMENT_CONFIG
  });
});

// 9. Historial de Señales emitidas
app.get('/api/signals/history', (req, res) => {
  const signals = db.getSignals(15);
  res.json({
    success: true,
    signals
  });
});

// 10. ENDPOINTS EXCLUSIVOS PARA EL PANEL DEL DUEÑO / ADMIN
// 10a. Autenticación de Dueño por Contraseña (Contraseña segura por defecto: AbelMaster#2026)
app.post('/api/admin/auth', (req, res) => {
  const { pin } = req.body;
  if (db.verifyAdminPin(pin)) {
    return res.json({
      success: true,
      token: 'admin_session_' + Date.now(),
      message: 'Acceso concedido al Panel de Dueño / Administrador.'
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Contraseña de Administrador incorrecta. Intenta de nuevo.'
  });
});

// 10a2. Cambiar Contraseña de Administrador
app.post('/api/admin/change-password', (req, res) => {
  try {
    const { newPassword } = req.body;
    db.changeAdminPassword(newPassword);
    res.json({
      success: true,
      message: 'Contraseña de administrador actualizada con éxito.'
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 10b. Métricas Financieras y Estadísticas del Negocio en Vivo
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    success: true,
    metrics: db.getAdminMetrics()
  });
});

// 10c. Bandeja Completa de Transacciones / Pagos Registrados
app.get('/api/admin/payments', (req, res) => {
  res.json({
    success: true,
    payments: db.getAllPayments()
  });
});

// 10d. Confirmar o Aprobar un Pago Manualmente
app.post('/api/admin/payments/:id/confirm', (req, res) => {
  try {
    const payment = db.confirmPayment(req.params.id);
    res.json({
      success: true,
      message: 'Pago confirmado y membresía activada con éxito.',
      payment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 10e. Lista de Cupones de Descuento
app.get('/api/admin/coupons', (req, res) => {
  res.json({
    success: true,
    coupons: db.getCoupons()
  });
});

// 10f. Crear Nuevo Cupón de Descuento
app.post('/api/admin/coupons', (req, res) => {
  try {
    const { code, discountPercent, description } = req.body;
    const coupon = db.createCoupon({ code, discountPercent, description });
    res.json({
      success: true,
      message: `Cupón ${coupon.code} creado exitosamente con ${coupon.discountPercent}% de descuento.`,
      coupon
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 11. Servir Frontend Compilado en Producción (dist)
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Trading AI Backend] Servidor ejecutándose en http://localhost:${PORT}`);
});
