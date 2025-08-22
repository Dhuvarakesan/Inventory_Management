import express from 'express';
import {
    addStock,
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
    withdrawStock,
} from '../controllers/product.controller';
import { getSystemLogs, getTransactionHistory } from '../controllers/transaction.controller';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/add-stock', addStock);
// Route to withdraw stock
router.patch('/:id/withdraw-stock', withdrawStock);

// Routes for transaction history and system logs
router.get('/transactions', getTransactionHistory);
router.get('/transactions/system-logs', getSystemLogs);

export default router;
