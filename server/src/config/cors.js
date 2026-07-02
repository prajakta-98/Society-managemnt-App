import AppError from '../utils/AppError.js';

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    const isAllowed =
      !origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin);

    if (isAllowed) {
      callback(null, true);
      return;
    }

    callback(new AppError('Origin is not allowed by CORS', 403));
  },
};

export default corsOptions;
