import { Request } from 'express';

export const validateStarReqData = (req: Request): boolean => {
    if (!req.body || !req.body.address || !req.body.star)
        return false
        
    return ['dec', 'ra', 'story'].every(p => p in req.body.star);
}