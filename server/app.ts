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

// Mount API routes under /api
app.use('/api', apiRouter);

export default app;
