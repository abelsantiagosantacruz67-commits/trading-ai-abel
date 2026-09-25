import https from 'https';
import WebSocket from 'ws';
import { realMarketService } from './realMarketService.js';

// Evitar problemas de certificados SSL en entornos específicos
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Mapeo exhaustivo de Active IDs oficiales de IQ Option a símbolos de nuestra plataforma
export const IQ_ACTIVE_MAP = {
  1: ['EURUSD', 'EURUSD-BLITZ', 'DIGITAL-EURUSD'],
  2: ['GBPUSD', 'GBPUSD-BLITZ', 'DIGITAL-GBPUSD'],
  3: ['USDJPY', 'USDJPY-BLITZ', 'DIGITAL-USDJPY'],
  4: ['EURGBP'],
  5: ['DIGITAL-EURJPY'],
  7: ['AUDCAD-BLITZ'],
  8: ['NZDUSD'],
  72: ['AUDUSD', 'DIGITAL-AUDUSD'],
  100: ['USDCAD'],
  // Pares OTC oficiales de IQ Option (24/7 y fin de semana)
  76: ['EURUSD-OTC', 'EURUSD-OTC-BLITZ', 'DIGITAL-EURUSD-OTC'],
  77: ['GBPUSD-OTC-BLITZ', 'DIGITAL-GBPUSD-OTC'],
  79: ['DIGITAL-EURJPY'],
  81: ['DIGITAL-GBPUSD-OTC'],
  84: ['DIGITAL-GBPJPY'],
  86: ['AUDCAD-BLITZ'],
  // Materias Primas / Commodities
  89: ['GOLD-BLITZ', 'XAUUSD', 'GOLD-OTC'],
  // Criptomonedas IQ Option
  816: ['BTCUSD-BLITZ'],
  // ETFs e Índices
  808: ['SPY'],
  1222: ['DIA']
};

class IQOptionBridge {
  constructor() {
    this.email = process.env.IQ_EMAIL || Buffer.from('YWJlbHNhbnRpYWdvc2FudGFjcnV6NjdAZ21haWwuY29t', 'base64').toString();
    this.password = process.env.IQ_PASSWORD || Buffer.from('ODcwNzA3MjY=', 'base64').toString();
    this.ssid = null;
    this.ws = null;
    this.isConnected = false;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.userProfile = null;
  }

  init() {
    console.log('[IQ Option Bridge] Iniciando enlace directo con los servidores de IQ Option...');
    this.loginAndConnect();
  }

  loginAndConnect() {
    if (!this.email || !this.password) {
      console.warn('[IQ Option Bridge] Credenciales de IQ Option no configuradas. Usando motor calibrado.');
      return;
    }

    const postData = JSON.stringify({
      identifier: this.email,
      password: this.password
    });

    const options = {
      hostname: 'auth.iqoption.com',
      port: 443,
      path: '/api/v2/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.code === 'success' && json.ssid) {
            this.ssid = json.ssid;
            console.log('[IQ Option Bridge] Autenticación HTTP exitosa con IQ Option. Conectando WebSocket oficial...');
            this.connectWebSocket();
          } else {
            console.warn('[IQ Option Bridge] Fallo al autenticar en IQ Option:', json.message || json.code);
            this.scheduleReconnect(15000);
          }
        } catch (e) {
          console.error('[IQ Option Bridge] Error procesando respuesta de login:', e.message);
          this.scheduleReconnect(15000);
        }
      });
    });

    req.on('error', (e) => {
      console.warn('[IQ Option Bridge] Error de conexión en login:', e.message);
      this.scheduleReconnect(15000);
    });

    req.write(postData);
    req.end();
  }

  connectWebSocket() {
    try {
      if (this.ws) {
        try { this.ws.terminate(); } catch (_) {}
      }

      this.ws = new WebSocket('wss://iqoption.com/echo/websocket', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      this.ws.on('open', () => {
        console.log('[IQ Option Bridge] WebSocket conectado. Enviando handshake de sesión...');
        this.ws.send(JSON.stringify({
          name: 'ssid',
          msg: this.ssid,
          request_id: 'auth_session'
        }));
      });

      this.ws.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          this.handleMessage(data);
        } catch (err) {
          // ignore parse errors
        }
      });

      this.ws.on('error', (err) => {
        console.warn('[IQ Option Bridge] WebSocket error:', err.message);
      });

      this.ws.on('close', (code) => {
        this.isConnected = false;
        clearInterval(this.heartbeatTimer);
        console.log(`[IQ Option Bridge] WebSocket cerrado (code: ${code}). Reconectando en 5s...`);
        this.scheduleReconnect(5000);
      });

    } catch (err) {
      console.error('[IQ Option Bridge] Error creando WebSocket:', err.message);
      this.scheduleReconnect(10000);
    }
  }

  handleMessage(msg) {
    if (!msg) return;

    // 1. Confirmación de autenticación
    if (msg.name === 'profile' || (msg.msg && msg.msg.user_id)) {
      this.isConnected = true;
      this.userProfile = msg.msg || null;
      console.log('---------------------------------------------------------');
      console.log('✅ [IQ Option Bridge] ENLACE ACTIVO CON IQ OPTION OFICIAL!');
      console.log(`Usuario IQ Option ID: ${this.userProfile?.user_id || 'Conectado'} - Cuenta: ${this.userProfile?.name || 'Abel'}`);
      console.log('---------------------------------------------------------');

      // Iniciar heartbeat cada 25 segundos para mantener sesión viva
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            name: 'heartbeat',
            msg: { userTime: Date.now(), heartbeatTime: Date.now() }
          }));
        }
      }, 25000);

      // Suscribirse a cotizaciones y velas de todos los activos mapeados
      this.subscribeAllActives();
    }

    // 2. Ticks en tiempo real (quote-generated)
    if (msg.name === 'quote-generated') {
      const q = msg.msg;
      if (!q || !q.active_id) return;
      const symbols = IQ_ACTIVE_MAP[q.active_id];
      if (!symbols) return;

      const price = q.value || q.bid || q.ask;
      if (!price || isNaN(price)) return;

      for (const symbol of symbols) {
        realMarketService.updateAssetPrice(symbol, price, {
          source: 'IQ Option Oficial (Feed Directo)',
          lastUpdate: Date.now(),
          volume: q.volume || 1
        });
      }
    }

    // 3. Velas completas en tiempo real (candle-generated)
    if (msg.name === 'candle-generated') {
      const c = msg.msg;
      if (!c || !c.active_id) return;
      const symbols = IQ_ACTIVE_MAP[c.active_id];
      if (!symbols) return;

      const price = c.close || c.value || c.ask;
      if (!price || isNaN(price)) return;

      for (const symbol of symbols) {
        realMarketService.updateAssetPrice(symbol, price, {
          source: 'IQ Option Oficial (Feed Directo)',
          high24h: c.max,
          low24h: c.min,
          volume: c.volume || 10,
          lastUpdate: Date.now()
        });
      }
    }
  }

  subscribeAllActives() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    console.log('[IQ Option Bridge] Suscribiendo a flujos de precios oficiales de IQ Option...');
    const activeIds = Object.keys(IQ_ACTIVE_MAP);

    activeIds.forEach((activeId, idx) => {
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          // Suscribirse a cotizaciones tick a tick
          this.ws.send(JSON.stringify({
            name: 'subscribeMessage',
            msg: {
              name: 'quote-generated',
              params: {
                routingFilters: {
                  active_id: parseInt(activeId, 10)
                }
              }
            },
            request_id: `sub_q_${activeId}`
          }));

          // Suscribirse a velas oficiales de 60s
          this.ws.send(JSON.stringify({
            name: 'subscribeMessage',
            msg: {
              name: 'candle-generated',
              params: {
                routingFilters: {
                  active_id: parseInt(activeId, 10),
                  size: 60
                }
              }
            },
            request_id: `sub_c_${activeId}`
          }));
        }
      }, idx * 100); // Espaciar 100ms para no saturar el websocket
    });
  }

  scheduleReconnect(delayMs) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      console.log('[IQ Option Bridge] Reintentando conexión con IQ Option...');
      this.loginAndConnect();
    }, delayMs);
  }
}

export const iqOptionBridge = new IQOptionBridge();
