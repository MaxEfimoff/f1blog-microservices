import { Request, Response, NextFunction } from 'express';
declare const requireAuth: (req: Request, res: Response, next: NextFunction) => void;
export { requireAuth };
