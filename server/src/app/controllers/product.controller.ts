import { Request, Response } from 'express';
import Product from '../models/product.model';
import Transaction from '../models/transaction.model';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            status: 'success',
            code: '201',
            message: 'Product created successfully.',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Failed to create product.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status: 'success',
            code: '200',
            message: 'Products fetched successfully.',
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Failed to fetch products.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Product not found.',
                error: `No product found with ID: ${id}`,
            });
        }
        res.status(200).json({
            status: 'success',
            code: '200',
            message: 'Product updated successfully.',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Failed to update product.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Product not found.',
                error: `No product found with ID: ${id}`,
            });
        }
        res.status(200).json({
            status: 'success',
            code: '200',
            message: 'Product deleted successfully.',
            data: deletedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Failed to delete product.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Add stock to an existing product
export const addStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const { userid, username } = req.headers;
        console.log('headers Test:', req.headers)

        if (!userid || !username) {
            return res.status(400).json({
                status: 'error',
                code: '400',
                message: 'User ID and User Name are required to log transactions.',
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Product not found.',
            });
        }

        product.quantity += quantity;
        await product.save();

        // Log transaction
        await Transaction.create({
            userid,
            username,
            action: 'addStock',
            description: `Added ${quantity} units to ${product.name}.`,
            productId: product.id,
            productName: product.name,
            previousStock: product.quantity - quantity,
            newStock: product.quantity,
            reason: req.body.reason || 'N/A',
        });

        console.log('Reason from frontend (addStock):', req.body.reason);

        if (product.quantity >= product.minCountLevel) {
            product.status = 'Active';
        }
        await product.save();

        res.status(200).json({
            status: 'success',
            code: '200',
            message: 'Stock added successfully.',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Failed to add stock.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Withdraw stock from an existing product
export const withdrawStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const { userid, username } = req.headers;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                code: '404',
                message: 'Product not found.',
            });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({
                status: 'error',
                code: '400',
                message: 'Insufficient stock.',
            });
        }

        product.quantity -= quantity;

        if (product.quantity < product.minCountLevel) {
            product.status = 'Low Stock';
        }
        await product.save();

        // Log transaction
        await Transaction.create({
            userid,
            username,
            action: 'withdrawStock',
            description: `Withdrew ${quantity} units from ${product.name}.`,
            productId: product.id,
            productName: product.name,
            previousStock: product.quantity + quantity,
            newStock: product.quantity,
            reason: req.body.reason || 'N/A',
        });

        console.log('Reason from frontend (withdrawStock):', req.body.reason);

        res.status(200).json({
            status: 'success',
            code: '200',
            message: 'Stock withdrawn successfully.',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: '500',
            message: 'Failed to withdraw stock.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
