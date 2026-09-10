# Guía Rápida para Subir Tu Plataforma a Internet

Tu plataforma de Trading con IA está **100% lista para producción**. El backend de Node.js ya está configurado para compilar el frontend y servirlo automáticamente en cualquier servidor de la nube con certificado SSL (`https://`) gratuito.

---

## Opción 1: Render.com (La Más Recomendada y 100% Gratuita)

Render permite alojar tu aplicación web completa gratis en pocos minutos con un subdominio público (ej: `https://nexus-trading-ai.onrender.com`).

### Pasos:
1. **Sube tu código a GitHub**:
   - Entra a [github.com](https://github.com) y crea un nuevo repositorio (puedes llamarlo `trading-ai-saas`, en modo Privado o Público).
   - Abre la terminal en la carpeta del proyecto:
     ```bash
     cd C:\Users\josue\.gemini\antigravity\scratch\trading-ai-saas
     git init
     git add .
     git commit -m "Plataforma Trading IA Lista para Internet"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO_GITHUB/trading-ai-saas.git
     git push -u origin main
     ```
2. **Conecta con Render**:
   - Entra a [render.com](https://render.com) e inicia sesión con tu cuenta de GitHub.
   - Haz clic en **"New +"** &gt; **"Web Service"**.
   - Selecciona tu repositorio `trading-ai-saas`.
   - Llena estos 3 campos (Render los detecta automáticamente con el archivo `render.yaml`):
     - **Name**: `nexus-trading-ai` (o el nombre que prefieras).
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Plan**: `Free` ($0/mes).
3. **Haz clic en "Create Web Service"**:
   - Render compilará tu sitio en aproximadamente 1 minuto.
   - ¡Listo! Te entregará una URL pública con HTTPS automático para compartir con tus clientes.

---

## Opción 2: Railway.app (Súper Rápido y Flexible)

1. Entra a [railway.app](https://railway.app) y haz clic en **"Start a New Project"**.
2. Selecciona **"Deploy from GitHub repo"**.
3. Selecciona tu repositorio. Railway detectará Node.js y ejecutará `npm run build` y `npm start` automáticamente.
4. Genera un dominio público en Settings &gt; Networking &gt; Generate Domain.

---

## Opción 3: Servidor VPS Propio (Hostinger, DigitalOcean, AWS)

Si tienes un VPS con Ubuntu:
```bash
# 1. Clonar el repositorio
git clone <tu-repo>
cd trading-ai-saas

# 2. Instalar dependencias y compilar
npm install
npm run build

# 3. Mantener el servidor encendido 24/7 con PM2
npm install -g pm2
pm2 start backend/server.js --name "trading-ai"
pm2 save
pm2 startup
```

---

## Tus Cuentas Oficiales Configuradas:
- **Nequi Colombia**: `312 620 2703` (Titular: **Abel Pacheco Santacruz**)
- **PayPal**: `abelsantiagosantacruz67@gmail.com` (Titular: **Abel Pacheco Santacruz** / QR Oficial Integrado)
- **Panel de Control del Dueño**: Botón `👑 Panel Dueño` en la barra de navegación (Contraseña Maestra: `AbelMaster#2026`).
