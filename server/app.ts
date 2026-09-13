import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes';
import { initDatabase } from './db';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database asynchronously (will connect to Postgres if DATABASE_URL is set, or fallback gracefully)
initDatabase().catch(err => {
  console.error('[ADVOCARE DB] Error during initDatabase:', err);
});

// Mount API routes under /api and root fallback (for Vercel rewrites)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Global error handler to prevent serverless function crashes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ADVOCARE SERVER ERROR]', err);
  if (!res.headersSent) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

export default app;
