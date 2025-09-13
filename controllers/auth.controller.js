import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession(); // Session of a mongoose transaction

  // Insight: Basically backend operations should be atomic. Either all or nothing. Insert works completely or it doesn't, Update works completely or it doesn't.

  session.startTransaction(); // Starting the mongoose transaction

  try {
    const { name, email, password } = req.body;

    // Checking if user has existed before
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409; // 409 typically means doesn't exists
      throw error;
    }

    // Hashing Password
    const salt = await bcrypt.genSalt(10); // Salt is to complexity to hash password and the default number is typically 10.
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session } // Here session has been attached. If anything goes wrong the user will not be created at all.
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true, 
      message: "User Signed In successfully",
      data: {
        token, 
        user
      }
    })
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {};
