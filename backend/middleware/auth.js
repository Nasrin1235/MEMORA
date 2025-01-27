import jwt from 'jsonwebtoken';


export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;  
  console.log('Token:', token); 
  
  if (!token) {
    return res.status(401).json({ error: "Authentication failed. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    console.log('Decoded User:', decoded); 
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message); 
    res.status(401).json({ error: "Invalid or expired token." });
  }
};