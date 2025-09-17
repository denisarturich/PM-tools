// server/index.ts
import 'dotenv/config';
import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// --- ESM-safe __dirname/__filename ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- tiny logger ---
function log(message: string, source = 'express') {
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// --- static files for production ---
function serveStatic(app: express.Express) {
  // ожидаем, что статика лежит рядом со сборкой в dist/public
  const distPublic = path.resolve(__dirname, 'public');
  if (!fs.existsSync(distPublic)) {
    throw new Error(
      `Could not find the build directory: ${distPublic}. Build the client or remove static serving.`
    );
  }
  app.use(express.static(distPublic));
  // SPA fallback
  app.use('*', (_req, res) => {
    res.sendFile(path.join(distPublic, 'index.html'));
  });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// access log for /api
app.use((req, res, next) => {
  const started = Date.now();
  const p = req.path;
  let captured: unknown;

  const origJson = res.json.bind(res);
  (res as any).json = (body: unknown) => {
    captured = body;
    return origJson(body);
  };

  res.on('finish', () => {
    if (p.startsWith('/api')) {
      const ms = Date.now() - started;
      let line = `${req.method} ${p} ${res.statusCode} in ${ms}ms`;
      if (captured) {
        const snippet = JSON.stringify(captured);
        if (snippet.length <= 80) line += ` :: ${snippet}`;
        else line += ` :: ${snippet.slice(0, 79)}…`;
      }
      log(line);
    }
  });

  next();
});

(async () => {
  // Регистрируем API/роуты (ожидаем, что вернётся http.Server)
  const server = await registerRoutes(app);

  // централизованный обработчик ошибок
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || 'Internal Server Error';
    console.error('[error]', err);
    res.status(status).json({ message });
    // НЕ бросаем дальше, чтобы не ронять процесс в проде
  });

  // Vite только в деве (динамический импорт, чтобы не тянуть его в прод)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { setupVite } = await import('./vite');
      await setupVite(app, server);
      log('Vite dev middlewares enabled', 'server');
    } catch (e) {
      console.warn('[vite]', 'dev middlewares disabled:', e);
    }
  } else {
    // продовая статика (если есть собранный фронт)
    try {
      serveStatic(app);
    } catch (e) {
      // Если фронт не нужен — это не критично: просто логируем
      console.warn('[static]', String(e));
    }
  }

  // Умный выбор порта: 5000 для Replit, 3000 для nginx и других сред
  const isReplit = process.env.REPLIT_DB_URL || process.env.REPL_ID || process.env.REPLIT_DEV_DOMAIN;
  const port = isReplit ? 5000 : 3000;
  const host = process.env.HOST ?? '127.0.0.1';
  
  console.log(`[config] Environment: ${isReplit ? 'Replit' : 'External'}, using port ${port}`);

  server.listen(
    { port, host, reusePort: true },
    () => log(`serving on ${host}:${port}`)
  );
})();
