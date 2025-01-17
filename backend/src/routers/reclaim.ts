import express from 'express';
import { receiveProof, validate } from '../middleware';
import Reclaim from '../controllers/reclaim';

const reclaim = express.Router();

reclaim.post('/proof', validate(receiveProof), Reclaim.receiveProof);
reclaim.get('/config/:provider', Reclaim.generateConfig);

export { reclaim };