import app from './app.js';
const PORT = process.env.PORT || 3001;

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

