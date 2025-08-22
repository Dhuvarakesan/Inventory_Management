import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';

// Fetch transaction history
export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.status(200).json({
      status: 'success',
      code: '200',
      message: 'Transaction history fetched successfully.',
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: '500',
      message: 'Failed to fetch transaction history.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Fetch system logs
export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Transaction.find().sort({ timestamp: -1 });
    res.status(200).json({
      status: 'success',
      code: '200',
      message: 'System logs fetched successfully.',
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: '500',
      message: 'Failed to fetch system logs.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
