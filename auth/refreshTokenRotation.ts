import jwt from "jsonwebtoken";
import prisma from "../utils/database/engine.js";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Check if refresh token matches the one in database
    const user = await prisma.user.findUnique({
      where: { username: verified.username },
    });

    if (!user || user.lastToken !== refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token is invalid or expired" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { username: verified.username },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_EXPIRES }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { username: verified.username },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES }
    );

    // Update refresh token in database
    await prisma.user.update({
      where: { username: verified.username },
      data: { lastToken: newRefreshToken },
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
