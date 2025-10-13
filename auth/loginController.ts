import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/database/engine.js";

// User login and JWT generation
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ username }, process.env.ACCESS_SECRET, {
      expiresIn: process.env.ACCESS_EXPIRES,
    });

    const refreshToken = jwt.sign({ username }, process.env.REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_EXPIRES,
    });

    // Update refresh token in database
    await prisma.user.update({
      where: { username },
      data: { lastToken: refreshToken },
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
