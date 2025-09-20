import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      // Check if the user has an admin role
      if (!decoded.role || !['Super Admin', 'Content Creator', 'Moderator'].includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      // Get user from the database and attach to the request
      const { rows } = await pool.query(
        'SELECT id, first_name, last_name, email, role, is_active FROM studio_users WHERE id = $1',
        [decoded.id]
      );
      
      const adminUser = rows[0];

      if (!adminUser || !adminUser.is_active) {
        return res.status(401).json({ message: 'Not authorized, user not found or inactive' });
      }

      // Attach user to request object (excluding password)
      req.user = adminUser;
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};