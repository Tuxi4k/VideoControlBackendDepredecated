// src/admin/auth/authService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "@config/constants";
import { UserRepository } from "@admin/database/userRepository";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  username: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<AuthResult> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign({ username }, config.ACCESS_SECRET, {
      expiresIn: config.ACCESS_EXPIRES as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ username }, config.REFRESH_SECRET, {
      expiresIn: config.REFRESH_EXPIRES as jwt.SignOptions["expiresIn"],
    });

    await this.userRepository.updateRefreshToken(username, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string): Promise<AuthResult> {
    const verified = jwt.verify(
      oldRefreshToken,
      config.REFRESH_SECRET
    ) as JwtPayload;

    const user = await this.userRepository.findByUsername(verified.username);
    if (!user || user.lastToken !== oldRefreshToken) {
      throw new Error("Refresh token is invalid or expired");
    }

    const newAccessToken = jwt.sign(
      { username: verified.username },
      config.ACCESS_SECRET,
      { expiresIn: config.ACCESS_EXPIRES as jwt.SignOptions["expiresIn"] }
    );

    const newRefreshToken = jwt.sign(
      { username: verified.username },
      config.REFRESH_SECRET,
      { expiresIn: config.REFRESH_EXPIRES as jwt.SignOptions["expiresIn"] }
    );

    await this.userRepository.updateRefreshToken(
      verified.username,
      newRefreshToken
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const verified = jwt.verify(
      refreshToken,
      config.REFRESH_SECRET
    ) as JwtPayload;
    await this.userRepository.updateRefreshToken(verified.username, null);
  }
}
