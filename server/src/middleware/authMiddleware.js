import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authorization.split(' ')[1];

  try {
    // A valid token payload should include the user's id and role.
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
}

export default authenticate;
