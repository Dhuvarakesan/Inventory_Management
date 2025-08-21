import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: string;
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = (decoded as jwt.JwtPayload).id;
      next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({
            message: "Authentication failed: Token has expired. Please login again.",
          });
        }
    
        if (err instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({
            message: "Authentication failed: Token is invalid.",
          });
        }
    
        // Handle any unexpected errors
        return res.status(500).json({
          message: "An unexpected error occurred during authentication.",
        });
      }
    };
};
