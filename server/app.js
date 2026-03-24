import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import aiRoutes from './api/routes/ai.js';
import dataRoutes from './api/routes/data.js';



dotenv.config();

const normalizeOrigin = (origin) => String(origin || '').trim().replace(/\/+$/, '');

const corsOrigin = normalizeOrigin(process.env.CORS_ORIGIN);
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

if (corsOrigin && !corsOrigins.includes(corsOrigin)) {
  corsOrigins.push(corsOrigin);
}

const devOrigins = new Set([
  normalizeOrigin('http://localhost:8080'),
  normalizeOrigin('http://localhost:5173'),
  normalizeOrigin('http://127.0.0.1:8080'),
  normalizeOrigin('http://127.0.0.1:5173'),
]);

const allowedOrigins = new Set([...corsOrigins, ...devOrigins]);

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedRequestOrigin = normalizeOrigin(origin);
      if (allowedOrigins.has(normalizedRequestOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${normalizedRequestOrigin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);

app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

export default app;