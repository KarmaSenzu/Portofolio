/**
 * ================================================
 * SUPABASE AUTHENTICATION MIDDLEWARE
 * ================================================
 * Verifies Supabase JWT tokens for protected routes
 * Replaces legacy JWT auth middleware
 * ================================================
 */

const { supabase } = require('../config/supabase');

/**
 * Verify Supabase authentication token
 * Attaches user and profile to req object
 */
async function verifyAuth(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to fetch user profile'
      });
    }

    if (!profile) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'User profile not found'
      });
    }

    // Attach user and profile to request object
    req.user = user;
    req.profile = profile;
    req.userId = user.id;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Authentication verification failed'
    });
  }
}

/**
 * Check if user has specific role
 * @param {string|string[]} allowedRoles - Role(s) allowed to access
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.profile) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = req.profile.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
}

/**
 * Optional auth - doesn't fail if no token
 * Useful for endpoints that work differently for authenticated users
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without auth
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      // Valid token - attach user info
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = user;
      req.profile = profile;
      req.userId = user.id;
    }

    // Continue regardless of auth status
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
  verifyAuth,
  requireRole,
  optionalAuth
};
