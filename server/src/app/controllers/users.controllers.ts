import { Request, Response } from 'express';
import User from '../models/users.modles';


import { CustomError } from '../errorHandeling/customError';
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
      data: savedUser.safeData
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, role, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new CustomError("User not found.", 404, "USER_NOT_FOUND", "The user with the specified ID does not exist.");
    }

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User updated successfully.",
      data: updatedUser.safeData
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new CustomError("User not found.", 404, "USER_NOT_FOUND", "The user with the specified ID does not exist.");
    }

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User deleted successfully.",
      data: deletedUser.safeData
    });
  } catch (error) {
    handleError(res, error);
  }
};

