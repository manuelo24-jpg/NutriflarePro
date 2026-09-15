import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { randomBytes } from 'crypto';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (userExists) {
      throw new BadRequestException('Email or username already in use');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash,
      },
    });

    return this.generateTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refreshToken(token: string) {
    const savedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      if (savedToken) {
        await this.prisma.refreshToken.delete({ where: { id: savedToken.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (savedToken.user.isBlocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    // Rotate refresh token (delete old)
    await this.prisma.refreshToken.delete({ where: { id: savedToken.id } });

    return this.generateTokens(savedToken.userId, savedToken.user.email, savedToken.user.role);
  }

  async logout(userId: string, token?: string) {
    if (token) {
      await this.prisma.refreshToken.deleteMany({
        where: { token, userId },
      });
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Return success to avoid email enumeration security risk
      return { message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' };
    }

    // Delete existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const tokenString = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    await this.prisma.passwordResetToken.create({
      data: {
        token: tokenString,
        userId: user.id,
        expiresAt,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, tokenString);

    return { message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      if (resetToken) {
        await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      }
      throw new BadRequestException('El token de restablecimiento es inválido o ha expirado.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    // Delete used token
    await this.prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return { message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const accessTokenPayload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshTokenString = randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }
}
