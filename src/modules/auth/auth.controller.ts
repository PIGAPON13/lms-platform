import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * ثبت نام کاربر جدید
   * با استفاده از ایمیل یا شماره موبایل
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'ثبت نام کاربر جدید',
    description: 'کاربر می‌تواند با ایمیل یا شماره موبایل ثبت نام کند',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      email: {
        summary: 'ثبت نام با ایمیل',
        value: {
          email: 'user@example.com',
          password: 'password123',
          firstName: 'علی',
          lastName: 'محمدی',
        },
      },
      phone: {
        summary: 'ثبت نام با شماره موبایل',
        value: {
          phoneNumber: '+989123456789',
          password: 'password123',
          firstName: 'علی',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'ثبت نام موفق',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'اطلاعات نادرست',
  })
  @ApiResponse({
    status: 409,
    description: 'کاربر قبلاً وجود دارد',
  })
  async register(@Body() registerDto: RegisterDto) {
    if (!registerDto.email && !registerDto.phoneNumber) {
      throw new BadRequestException(
        'حداقل ایمیل یا شماره موبایل باید وارد شود',
      );
    }

    return this.authService.register(registerDto);
  }

  /**
   * ورود با ایمیل/شماره و رمز عبور
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ورود به سیستم',
    description: 'ورود با ایمیل یا شماره موبایل + رمز عبور',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'ورود موفق',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'اطلاعات ورود نادرست',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * ارسال کد OTP به شماره موبایل
   */
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ارسال کد تایید (OTP)',
    description: 'کد 6 رقمی برای تایید شماره موبایل ارسال می‌شود',
  })
  @ApiBody({
    type: SendOtpDto,
  })
  @ApiResponse({
    status: 200,
    description: 'کد OTP ارسال شد',
    schema: {
      example: {
        message: 'کد تایید با موفقیت ارسال شد',
        expiresIn: 120,
      },
    },
  })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  /**
   * تایید OTP و ورود
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'تایید کد OTP و ورود',
    description:
      'کاربر کد دریافتی را وارد می‌کند و سیستم او را وارد می‌کند یا ثبت می‌کند',
  })
  @ApiBody({
    type: VerifyOtpDto,
  })
  @ApiResponse({
    status: 200,
    description: 'OTP تایید شد و کاربر وارد سیستم شد',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'کد OTP نادرست یا منقضی شده',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  /**
   * تجدید Access Token
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'تجدید Access Token',
    description: 'با استفاده از Refresh Token می‌توان Access Token جدید دریافت کرد',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Access Token جدید دریافت شد',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh Token نامعتبر یا منقضی شده',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  /**
   * خروج از سیستم
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'خروج از سیستم',
    description: 'حذف Refresh Token و خروج کاربر',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'کاربر با موفقیت خارج شد',
    schema: {
      example: {
        message: 'با موفقیت خارج شدید',
      },
    },
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }
}
