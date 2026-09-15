import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes under /api and root / to support direct and rewritten paths smoothly in Vercel Serverless
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback JSON 404 handler for API routes to prevent returning HTML error pages
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl || req.url}' tidak ditemukan.`,
    path: req.originalUrl || req.url
  });
});

// Global error handler to guarantee valid JSON responses on any runtime exception
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ADVOCARE SERVER ERROR]', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal Server Error'
    });
  }
});

export default app;
