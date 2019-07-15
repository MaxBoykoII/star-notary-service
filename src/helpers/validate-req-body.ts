import { Request } from 'express';

export const validateReqBody = (req: Request, props: string[]): boolean => {
    if (!req.body)
        return false;
    return props.every(p => p in req.body);
}