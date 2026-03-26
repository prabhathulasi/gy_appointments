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
  origin: ['http://localhost:5001',"*"], // Allow all origins. Replace with specific origin(s) in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
})

app.get('/', (req: Request, res: Response) => {
    res.send(config.clientUrl)
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
        });
    }
    next();
})

export default app;