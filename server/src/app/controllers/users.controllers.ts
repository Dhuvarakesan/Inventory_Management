import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import User from '../models/users.modles';

import { secretKey } from '../../config/config';
import handleError from '../errorHandeling/handelError'; // Import the handleError function

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      code: "200",
      message: "Users fetched successfully.",
      data: users
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, isActive } = req.body;
    const newUser = new User({ name, email, password, role, isActive });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json({
      status: "success",
      code: "201",
      message: "User created successfully.",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Failed to create user.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;

    const updateData: any = { name, email, role, isActive };

    // Encrypt the password if provided
    if (password) {
      updateData.password = CryptoJS.AES.encrypt(password, secretKey).toString();
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        code: "404",
        message: "User not found.",
        error: `No user found with ID: ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Failed to update user.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        code: "404",
        message: "User not found.",
        error: `No user found with ID: ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User deleted successfully.",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Failed to delete user.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

