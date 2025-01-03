import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from './user.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { throwError } from 'rxjs';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialDto: AuthCredentialsDto): Promise<void> {
    if (!authCredentialDto) {
      throw new NotFoundException(`password or username is empty`);
    }
    return this.userRepository.createUser(authCredentialDto);
  }

  async signin(
    authCredentialDto: AuthCredentialsDto,
  ): Promise<{ acessToken: string }> {
    const { username, password } = authCredentialDto;
    const findUser = await this.userRepository.findOneBy({ username });

    if (findUser && (await compare(password, findUser.password))) {
      // return this.userRepository.loginUser(authCredentialDto);
      const payload: IJwtPayload = { username };
      const acessToken: string = await this.jwtService.sign(payload);
      return { acessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
