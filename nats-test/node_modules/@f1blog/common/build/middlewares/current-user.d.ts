import { Request, Response, NextFunction } from 'express';
interface JWTRequest extends Request {
    headers: {
        authorization: string;
    };
    user?: UserPayload;
}
interface UserPayload {
    id: string;
    name: string;
    iat: number;
    exp: number;
}
declare const currentUser: (req: JWTRequest, res: Response, next: NextFunction) => void;
export { currentUser };
