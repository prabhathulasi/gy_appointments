import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import ApiError from './errors/apiError';
import router from './app/routes';
import config from './config';

const app: Application = express();


app.use(CookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
})

app.get('/', async (req: Request, res: Response) => {
    try {
        res.send(`Server is running. Env: ${config.env}`)
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
})

app.use('/api/v1', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Unhandled Error:", err); // <== Log the actual error
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message })
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Something Went Wrong',
            errorName: err.name,
            errorDetail: String(err),
            errorStack: err.stack?.split('\n').slice(0, 5),
        });
    }
    next();
})

export default app;