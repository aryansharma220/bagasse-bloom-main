import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import aiRoutes from './api/routes/ai.js';
import dataRoutes from './api/routes/data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigin = process.env.CORS_ORIGIN;
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (corsOrigin && !corsOrigins.includes(corsOrigin)) {
  corsOrigins.push(corsOrigin);
}

const devOrigins = new Set([
  'http://localhost:8080',
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
]);

const allowedOrigins = new Set([...corsOrigins, ...devOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
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

const server = app.listen(PORT, () => {
  console.log(`BioGraphX API server running on http://localhost:${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/health`);
});

server.on('error', async (error) => {
  if (error?.code !== 'EADDRINUSE') {
    console.error('Server startup error:', error);
    process.exit(1);
  }

  // If another BioGraphX API is already running, reuse it and avoid crashing dev startup.
  try {
    const response = await fetch(`http://localhost:${PORT}/health`);
    if (response.ok) {
      console.log(`API already running on port ${PORT}; reusing existing process.`);
      process.exit(0);
    }
  } catch {
    // Fall through to hard failure when another unknown service is occupying the port.
  }

  console.error(`Port ${PORT} is in use by another process. Stop it or change PORT in .env.`);
  process.exit(1);
});
