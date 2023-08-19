import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.handleHashPassword(
      registerUserDto.password,
    );

    return await this.userRepository.save({
      ...registerUserDto,
      refresh_token: 'text',
      password: hashPassword,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new HttpException('Email is not exit', HttpStatus.UNAUTHORIZED);
    }

    const isCheckPassword = bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );

    if (!isCheckPassword) {
      throw new HttpException(
        'Email/password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { id: user.id, email: user.email };

    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string) {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET'),
      });

      const CheckExitToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });

      if (CheckExitToken) {
        const payload = {
          id: CheckExitToken.id,
          email: CheckExitToken.email,
        };

        return this.generateToken(payload);
      } else {
        throw new HttpException(
          'Refresh token is valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException('Refresh token is valid', HttpStatus.BAD_REQUEST);
    }
  }

  async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
    });
    const user = await this.userRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    await this.userRepository.update(
      { email: payload.email },
      { refresh_token },
    );

    const data = {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
      },
    };

    return {
      res: {
        data,
        status: 200,
        message: 'Ok',
      },
    };
  }

  async handleHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
