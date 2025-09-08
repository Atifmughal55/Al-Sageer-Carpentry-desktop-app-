import {
  getUser,
  registerUsre,
  updatePasswordModel,
} from "../models/authentication.model.js";
import bcrypt, { genSalt } from "bcryptjs";

export const registerController = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide email and password",
      });
    }

    const user = await getUser(db, email);
    if (user) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10); // ✅ Corrected
    const hashedPassword = await bcrypt.hash(password, salt);
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    const data = {
      email,
      password: hashedPassword,
      recoveryCode,
    };

    await registerUsre(db, data);
    const getCreatedUser = await getUser(db, email);

    return res.status(201).json({
      success: true,
      error: false,
      message: "User created successfully",
      recoveryCode, // ✅ Include this so the user can store it
      user: getCreatedUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Email or password missing",
      });
    }

    const user = await getUser(db, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid password.",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Login Successfully",
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { email } = req.body;

    if (!email) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Email not provided",
      });
    }

    const user = await getUser(db, email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      recoveryCode: user.recoveryCode,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { email, recoveryCode, newPassword } = req.body;

    if (!email || !recoveryCode || !newPassword) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "email,password or recoveryCode not provided",
      });
    }

    const user = await getUser(db, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    if (recoveryCode !== user.recoveryCode) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Your code is not correct",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const data = {
      email,
      password: hashedPassword,
    };

    const updatePassword = await updatePasswordModel(db, data);

    return res.status(201).json({
      success: true,
      error: false,
      message: "Password update successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { email, password, newPassword } = req.body;

    if (!email || !password || !newPassword) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Please provide all fields",
      });
    }

    const user = await getUser(db, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Password does not match",
      });
    }

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const data = { email, password: hashedPassword };

    await updatePasswordModel(db, data);

    return res.status(201).json({
      success: true,
      error: false,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong",
    });
  }
};
