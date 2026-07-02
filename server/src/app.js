import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors.js';
import authRoutes from './routes/authRoutes.js';
import societyRoutes from './routes/societyRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/societies', societyRoutes);

// These must be registered after all valid application routes.
app.use(notFound);
app.use(errorHandler);

export default app;
