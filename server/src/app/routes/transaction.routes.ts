import express from 'express';
import { getSystemLogs, getTransactionHistory } from '../controllers/transaction.controller';

const router = express.Router();

// Routes for transaction history and system logs
router.get('/', getTransactionHistory);
router.get('/system-logs', getSystemLogs);

export default router;
