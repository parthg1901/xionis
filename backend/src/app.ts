import cors from 'cors';
import { Express, Request, Response } from 'express';
import express from 'express';
import { errorHandler } from './middleware';
import * as dotenv from 'dotenv';
import path from 'path';
import { reclaim } from './routers';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

/**
 * Health check endpoint.
 */
app.get('/ping', (_req: Request, res: Response) => {
  res.status(200).send('pong');
});

app.use('/api/v1/reclaim', reclaim);

app.use(errorHandler);