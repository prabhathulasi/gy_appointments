import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  res.json({ status: 'working', path: req.url });
}
