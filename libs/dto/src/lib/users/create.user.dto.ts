import { OmitType } from '@nestjs/swagger';
import { UsersDto } from './users.dto';

export class CreateUserDto extends OmitType(UsersDto, ['userId', 'userStatus'] as const) {



}